import { useEffect, useState } from "react";
import ShipmentRepository from "../repositories/shipment";
import { EDeliveryStatus, IDelivery } from "../../../shared/interfaces";
import UserRepository from "../repositories/user";
import toast from "react-hot-toast";

interface IDriver {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function ShipmentsTable() {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState<IDelivery | null>(
    null
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Assign driver modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [driverList, setDriverList] = useState<IDriver[]>([]);
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
      UserRepository.listActiveDrivers()
        .then(({ data }) => {
          const drivers = data.items;
          resolve(
            drivers.map((driver) => ({
              name: `${driver.firstName} ${driver.lastName}`,
              isActive: true,
              _id: driver._id.toString(),
            }))
          );
        })
        .catch(reject);
    });
  }

  useEffect(() => {
    fetchDeliveries(page);
  }, [page]);

  // Open assign modal and load drivers
  const openAssignModal = async () => {
    setDropdownOpenId(null);
    setShowAssignModal(true);
    setSelectedDriverId(null);
    const drivers = await fetchDrivers();
    setDriverList(drivers.filter((d) => d.isActive));
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
    // Try to get from driverList if available, fallback to id
    const assignedId =
      typeof selectedDelivery.assignedDriver === "string"
        ? selectedDelivery.assignedDriver
        : selectedDelivery.assignedDriver.toString();
    const driver = driverList.find((d) => d._id === assignedId);
    return driver ? driver.name : assignedId;
  };

  const deliveryStatusColors: Record<EDeliveryStatus, string> = {
    [EDeliveryStatus.pending]: "bg-yellow-100 text-yellow-800",
    [EDeliveryStatus.assigned]: "bg-blue-100 text-blue-800",
    [EDeliveryStatus.in_transit]: "bg-purple-100 text-purple-800",
    [EDeliveryStatus.delivered]: "bg-green-100 text-green-800",
    [EDeliveryStatus.cancelled]: "bg-red-100 text-red-800",
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                S/N
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                Tracking #
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                Customer
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                Destination
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">
                Status
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
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No deliveries found.
                </td>
              </tr>
            ) : (
              deliveries.map((d, index) => {
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

            {selectedDelivery.assignedDriver && (
              <section className="bg-gray-100 p-4 rounded mt-4">
                <h4 className="font-semibold mb-1">Driver: </h4> <span>{selectedDelivery.assignedDriver?.toString()}</span>
                {/* <span className="whitespace-pre-wrap text-gray-700">
                  Name:   {selectedDelivery.assignedDriver}
                </span> */}
                {/* <br />
                <span className="whitespace-pre-wrap text-gray-700">
                  Email: 
                </span>
                <br />
                <span className="whitespace-pre-wrap text-gray-700">
                  Phone: 
                </span> */}
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
              {driverList.length === 0 ? (
                <p>No active drivers available.</p>
              ) : (
                <ul>
                  {driverList.map((driver) => (
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
