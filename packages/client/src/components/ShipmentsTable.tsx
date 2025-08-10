import { useEffect, useState } from "react";
import ShipmentRepository from "../repositories/shipment";
import { EDeliveryStatus, IDelivery } from "../../../shared/interfaces";
import UserRepository from "../repositories/user";
import toast from "react-hot-toast";
// import Websocket from "../services/ws";

interface IDriver {
  _id: string;
  name: string;
  phone?: string;
  email: string;
  isActive: boolean;
}

type SortField = 'trackingNumber' | 'customerName' | 'destinationAddress.city' | 'status' | 'estimatedDeliveryDate';
type SortDirection = 'asc' | 'desc';

export default function ShipmentsTable() {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EDeliveryStatus | "">("");
  const [cityFilter, setCityFilter] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('trackingNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [selectedDelivery, setSelectedDelivery] = useState<IDelivery | null>(
    null
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Assign driver modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeDriverList, setActiveDriverList] = useState<IDriver[]>([]);
  const [allDriverList, setAllDriverList] = useState<IDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  // Unassign driver modal
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [unassigning, setUnassigning] = useState(false);

  async function fetchDeliveries(pageNum: number) {
    setLoading(true);
    try {
      const { data } = await ShipmentRepository.listDeliveries(pageNum);
      setDeliveries(data.items);
      setPage(data.page);
      setLimit(data.limit || 10);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  // fetch active drivers
  async function fetchDrivers() {
    return new Promise<IDriver[]>((resolve, reject) => {
      UserRepository.listDrivers()
        .then(({ data }) => {
          const drivers = data.items;
          resolve(
            drivers.map((driver) => ({
              _id: driver._id.toString(),
              name: `${driver.firstName} ${driver.lastName}`,
              email: driver.email,
              phone: driver?.phone,
              isActive: driver.status === 'active',
            }))
          );
        })
        .catch(reject);
    });
  }

  // Filter and sort deliveries
  const filterAndSortDeliveries = () => {
    let filtered = [...deliveries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery => 
        delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerPhone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Apply city filter
    if (cityFilter) {
      filtered = filtered.filter(delivery => 
        delivery.destinationAddress.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'trackingNumber':
          aValue = a.trackingNumber;
          bValue = b.trackingNumber;
          break;
        case 'customerName':
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case 'destinationAddress.city':
          aValue = a.destinationAddress.city;
          bValue = b.destinationAddress.city;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'estimatedDeliveryDate':
          aValue = new Date(a.estimatedDeliveryDate);
          bValue = new Date(b.estimatedDeliveryDate);
          break;
        default:
          aValue = a.trackingNumber;
          bValue = b.trackingNumber;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredDeliveries(filtered);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCityFilter("");
    setSortField('trackingNumber');
    setSortDirection('asc');
  };

  // Get unique cities for filter dropdown
  const getUniqueCities = () => {
    const cities = deliveries.map(d => d.destinationAddress.city);
    return [...new Set(cities)].sort();
  };

  useEffect(() => {
    fetchDeliveries(page);
    fetchDrivers()
    .then((drivers) => {
      setActiveDriverList(drivers.filter((d) => d.isActive));
      setAllDriverList(drivers);
    });
  }, [page]);

  useEffect(() => {
    filterAndSortDeliveries();
  }, [deliveries, searchTerm, statusFilter, cityFilter, sortField, sortDirection]);

  // Open assign modal and load drivers
  const openAssignModal = async () => {
    fetchDrivers()
    .then((drivers) => {
      setActiveDriverList(drivers.filter((d) => d.isActive));
      setAllDriverList(drivers);
    });
    setDropdownOpenId(null);
    setShowAssignModal(true);
    setSelectedDriverId(null);
  };

  // Assign driver to selected delivery
  const confirmAssignDriver = async () => {
    if (!selectedDelivery || !selectedDriverId) return;
    setAssigning(true);

    try {
      if (
        !confirm(
          `You are about to assign driver ${selectedDriverId} to delivery ${selectedDelivery._id}`
        )
      )
        return;

      await ShipmentRepository.assignDriver(
        selectedDriverId,
        selectedDelivery._id.toString(),
      ).then(({ message }) => toast.success(message)).catch((e) => toast.error(e.response.data.message));
      await fetchDeliveries(page);

      setShowAssignModal(false);
      setSelectedDriverId(null);
    } catch (error) {
      console.error("Failed to assign driver:", error);
    } finally {
      setAssigning(false);
    }
  };

  // Open unassign modal
  const openUnassignModal = (deliveryId: string) => {
    console.log(deliveryId);
    
    setDropdownOpenId(null);
    setShowUnassignModal(true);
  };

  // Unassign driver from selected delivery
  const confirmUnassignDriver = async () => {
    if (!selectedDelivery) return;
    setUnassigning(true);

    try {
      alert(`Unassigned driver from delivery ${selectedDelivery._id}`);

      await fetchDeliveries(page);

      setShowUnassignModal(false);
    } catch (error) {
      console.error("Failed to unassign driver:", error);
    } finally {
      setUnassigning(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpenId((prev) => (prev === id ? null : id));
  };

  // const isDriverAssigned = (
  //   assignedDriver?: string | ObjectId | null,
  //   driverId?: string | null
  // ) => {
  //   if (!assignedDriver || !driverId) return false;
  //   const assignedDriverStr =
  //     typeof assignedDriver === "string"
  //       ? assignedDriver
  //       : assignedDriver.toString();
  //   return assignedDriverStr === driverId;
  // };

  function closeModal() {
    setSelectedDelivery(null);
  }

  // Get assigned driver name if available
  const getAssignedDriverName = () => {
    if (!selectedDelivery?.assignedDriver) return "No driver assigned";
    // Try to get from activeDriverList if available, fallback to id
    const assignedId =
      typeof selectedDelivery.assignedDriver === "string"
        ? selectedDelivery.assignedDriver
        : selectedDelivery.assignedDriver.toString();
    const driver = activeDriverList.find((d) => d._id === assignedId);
    return driver ? driver.name : assignedId;
  };

  // Get assigned driver
  const getAssignedDriver = (): IDriver | undefined => {
    if (!selectedDelivery?.assignedDriver) return undefined;
    const assignedId =
      typeof selectedDelivery.assignedDriver === "string"
        ? selectedDelivery.assignedDriver
        : selectedDelivery.assignedDriver.toString();
    const driver = allDriverList.find((d) => d._id === assignedId);
    return driver;
  };

  const deliveryStatusColors: Record<EDeliveryStatus, string> = {
    [EDeliveryStatus.pending]: "bg-yellow-100 text-yellow-800",
    [EDeliveryStatus.assigned]: "bg-blue-100 text-blue-800",
    [EDeliveryStatus.in_transit]: "bg-purple-100 text-purple-800",
    [EDeliveryStatus.delivered]: "bg-green-100 text-green-800",
    [EDeliveryStatus.cancelled]: "bg-red-100 text-red-800",
  };

  // Websocket.onEvent('DELIVERY', () => {
  //   fetchDeliveries(page);
  // });

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search tracking #, customer, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EDeliveryStatus | "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Statuses</option>
              {Object.values(EDeliveryStatus).map(status => (
                <option key={status} value={status} className="capitalize">
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Destination City
            </label>
            <select
              id="city-filter"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Cities</option>
              {getUniqueCities().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter || cityFilter) && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded capitalize">
                Status: {statusFilter.replace('_', ' ')}
              </span>
            )}
            {cityFilter && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                City: {cityFilter}
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                S/N
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('trackingNumber')}
              >
                Tracking # {getSortIndicator('trackingNumber')}
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('customerName')}
              >
                Customer {getSortIndicator('customerName')}
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('destinationAddress.city')}
              >
                Destination {getSortIndicator('destinationAddress.city')}
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status {getSortIndicator('status')}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 border-b">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  {deliveries.length === 0 ? "No deliveries found." : "No deliveries match your filters."}
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((d, index) => {
                const sn = (page - 1) * limit + index + 1;
                return (
                  <tr
                    key={d._id.toString()}
                    className="hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                    onClick={() => setSelectedDelivery(d)}
                  >
                    <td className="py-3 px-4">{sn}</td>
                    <td className="py-3 px-4">{d.trackingNumber}</td>
                    <td className="py-3 px-4">{d.customerName}</td>
                    <td className="py-3 px-4">{d.destinationAddress.city}</td>
                    <td className={`py-3 px-4 capitalize ${deliveryStatusColors[d.status]}`}>{d.status}</td>
                    <td
                      className="py-3 px-4 text-center relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleDropdown(d._id.toString())}
                        className="bg-[#cf1112] hover:bg-[#b50e0f] text-white px-3 py-1 rounded text-sm"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpenId === d._id.toString()}
                        aria-controls={`dropdown-menu-${d._id}`}
                      >
                        Actions ▼
                      </button>

                      {dropdownOpenId === d._id.toString() && (
                        <ul
                          id={`dropdown-menu-${d._id}`}
                          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-20"
                        >
                          <li>
                            <button
                              disabled={d.status !== EDeliveryStatus.pending}
                              onClick={() => {
                                if (d.status === EDeliveryStatus.pending) {
                                  setSelectedDelivery(d);
                                  openAssignModal();
                                }
                              }}
                              className={`w-full text-left px-4 py-2 ${
                                d.status === EDeliveryStatus.pending
                                  ? "hover:bg-[#fff8f8]"
                                  : ""
                              }`}
                            >
                              Assign Driver
                            </button>
                          </li>
                          <li>
                            <button
                              disabled={d.status !== EDeliveryStatus.assigned}
                              onClick={() => {
                                if (d.status === EDeliveryStatus.assigned) {
                                  setSelectedDelivery(d);
                                  openUnassignModal(d._id.toString());
                                }
                              }}
                              className={`w-full text-left px-4 py-2 ${
                                d.status === EDeliveryStatus.assigned
                                  ? "hover:bg-[#fff8f8]"
                                  : ""
                              }`}
                            >
                              Unassign Driver
                            </button>
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center space-x-3 items-center">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded border ${
            page <= 1 || loading
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-[#cf1112] text-[#cf1112] hover:bg-[#b50e0f]"
          }`}
        >
          Previous
        </button>

        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-1 rounded border ${
            page >= totalPages || loading
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-[#cf1112] text-[#cf1112] hover:bg-[#b50e0f]"
          }`}
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      {selectedDelivery && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-xl font-bold mb-2">
              Delivery Details
            </h3>

            <section className="bg-gray-100 p-4 rounded space-y-2">
              <DetailItem
                label="Tracking #"
                value={selectedDelivery.trackingNumber}
              />
              <DetailItem
                label="Customer"
                value={selectedDelivery.customerName}
              />
              <DetailItem
                label="Phone"
                value={selectedDelivery.customerPhone}
              />
              <DetailItem
                label="Email"
                value={selectedDelivery!.customerEmail!}
              />
            </section>

            <section className="bg-gray-100 p-4 rounded space-y-2">
              <DetailItem
                label="Pickup Address"
                value={`${selectedDelivery.pickupAddress.street}, ${selectedDelivery.pickupAddress.city}, ${selectedDelivery.pickupAddress.state} ${selectedDelivery.pickupAddress.zipCode}`}
              />
              <DetailItem
                label="Destination Address"
                value={`${selectedDelivery.destinationAddress.street}, ${selectedDelivery.destinationAddress.city}, ${selectedDelivery.destinationAddress.state} ${selectedDelivery.destinationAddress.zipCode}`}
              />
            </section>

            <section className="bg-gray-100 p-4 rounded space-y-2">
              <DetailItem
                className={deliveryStatusColors[selectedDelivery.status]}
                label="Status"
                value={selectedDelivery.status}
                capitalize
              />
              <DetailItem
                label="Priority"
                value={selectedDelivery.priority}
                capitalize
              />
              <DetailItem
                label="Estimated Delivery Date"
                value={new Date(
                  selectedDelivery.estimatedDeliveryDate
                ).toLocaleDateString()}
              />
            </section>

            {selectedDelivery.notes && (
              <section className="bg-gray-100 p-4 rounded mt-4">
                <h4 className="font-semibold mb-1">Notes</h4>
                <p className="whitespace-pre-wrap text-gray-700">
                  {selectedDelivery.notes}
                </p>
              </section>
            )}

            {selectedDelivery.assignedDriver && getAssignedDriver() && (
              <section className="bg-gray-100 p-4 rounded mt-4">
                <h4 className="font-semibold mb-1">Driver</h4>
                <span className="whitespace-pre-wrap text-gray-700">
                  Name: {getAssignedDriver()?.name}
                </span>
                <br />
                <span className="whitespace-pre-wrap text-gray-700">
                  Email: {getAssignedDriver()?.email}
                </span>
                <br />
                {
                  getAssignedDriver()?.phone && (
                    <span className="whitespace-pre-wrap text-gray-700">
                      Phone: {getAssignedDriver()?.phone}
                    </span>
                  )
                }
              </section>
            )}

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {showAssignModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAssignModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-driver-title"
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="assign-driver-title" className="text-xl font-bold mb-4">
              Assign Driver
            </h3>

            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded p-2">
              {activeDriverList.length === 0 ? (
                <p>No active drivers available.</p>
              ) : (
                <ul>
                  {activeDriverList.map((driver) => (
                    <li key={driver._id} className="mb-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="driver"
                          value={driver._id}
                          checked={selectedDriverId === driver._id}
                          onChange={() => setSelectedDriverId(driver._id)}
                          className="form-radio text-[#cf1112]"
                        />
                        <span>{driver.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={assigning}
              >
                Cancel
              </button>

              <button
                onClick={confirmAssignDriver}
                className="px-4 py-2 rounded bg-[#cf1112] text-white hover:bg-[#b50e0f] disabled:opacity-50"
                disabled={!selectedDriverId || assigning}
              >
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unassign Driver Modal */}
      {showUnassignModal && selectedDelivery && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowUnassignModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="unassign-driver-title"
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="unassign-driver-title" className="text-xl font-bold mb-4">
              Unassign Driver
            </h3>

            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded p-4">
              <p>
                Current assigned driver:{" "}
                <strong>{getAssignedDriverName()}</strong>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUnassignModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={unassigning}
              >
                Cancel
              </button>

              <button
                onClick={confirmUnassignDriver}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={unassigning}
              >
                {unassigning ? "Unassigning..." : "Unassign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({
  className,
  label,
  value,
  capitalize = false,
}: {
  className?: string,
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <p>
      <strong>{label}:</strong>{" "}
      <span className={`${className || ''} ${capitalize ? "capitalize" : undefined}`}>{value}</span>
    </p>
  );
}