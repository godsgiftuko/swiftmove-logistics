import { useEffect, useState } from "react";
import { IDelivery } from "../../../shared/interfaces";
import ShipmentRepository from "../repositories/shipment";
import Websocket from "../services/ws";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type SortField = 'trackingNumber' | 'customerName' | 'pickupAddress.city' | 'destinationAddress.city' | 'status' | 'estimatedDeliveryDate' | 'priority';
type SortDirection = 'asc' | 'desc';

const DriverShipmentTable = () => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pickupCityFilter, setPickupCityFilter] = useState("");
  const [destinationCityFilter, setDestinationCityFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('trackingNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [selectedDelivery, setSelectedDelivery] = useState<IDelivery | null>(null);

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

  async function updateStatus(
    id: string,
    status: "in_transit" | "cancelled" | "delivered"
  ) {
    try {
      setUpdatingId(id);
      await ShipmentRepository.updateStatus(id, status);
      await fetchDeliveries(page);
      setSelectedDelivery(null);
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    } finally {
      setUpdatingId(null);
    }
  }

  // Filter and sort deliveries
  const filterAndSortDeliveries = () => {
    let filtered = [...deliveries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery => 
        delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerPhone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Apply pickup city filter
    if (pickupCityFilter) {
      filtered = filtered.filter(delivery => 
        delivery.pickupAddress.city.toLowerCase().includes(pickupCityFilter.toLowerCase())
      );
    }

    // Apply destination city filter
    if (destinationCityFilter) {
      filtered = filtered.filter(delivery => 
        delivery.destinationAddress.city.toLowerCase().includes(destinationCityFilter.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(delivery => delivery.priority === priorityFilter);
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
        case 'pickupAddress.city':
          aValue = a.pickupAddress.city;
          bValue = b.pickupAddress.city;
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
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
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
    setPickupCityFilter("");
    setDestinationCityFilter("");
    setPriorityFilter("");
    setSortField('trackingNumber');
    setSortDirection('asc');
  };

  // Get unique values for filter dropdowns
  const getUniqueStatuses = () => {
    const statuses = deliveries.map(d => d.status);
    return [...new Set(statuses)].sort();
  };

  const getUniquePickupCities = () => {
    const cities = deliveries.map(d => d.pickupAddress.city);
    return [...new Set(cities)].sort();
  };

  const getUniqueDestinationCities = () => {
    const cities = deliveries.map(d => d.destinationAddress.city);
    return [...new Set(cities)].sort();
  };

  const getUniquePriorities = () => {
    const priorities = deliveries.map(d => d.priority);
    return [...new Set(priorities)].sort();
  };

  useEffect(() => {
    fetchDeliveries(page);
  }, [page]);

  useEffect(() => {
    filterAndSortDeliveries();
  }, [deliveries, searchTerm, statusFilter, pickupCityFilter, destinationCityFilter, priorityFilter, sortField, sortDirection]);

  Websocket.onEvent('DELIVERY_ASSIGNED', () => {
    fetchDeliveries(page);
  });

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search tracking #, customer, phone..."
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Statuses</option>
              {getUniqueStatuses().map(status => (
                <option key={status} value={status} className="capitalize">
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup City Filter */}
          <div>
            <label htmlFor="pickup-city-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup City
            </label>
            <select
              id="pickup-city-filter"
              value={pickupCityFilter}
              onChange={(e) => setPickupCityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Pickup Cities</option>
              {getUniquePickupCities().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Destination City Filter */}
          <div>
            <label htmlFor="destination-city-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Destination City
            </label>
            <select
              id="destination-city-filter"
              value={destinationCityFilter}
              onChange={(e) => setDestinationCityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Destination Cities</option>
              {getUniqueDestinationCities().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cf1112] focus:border-[#cf1112]"
            >
              <option value="">All Priorities</option>
              {getUniquePriorities().map(priority => (
                <option key={priority} value={priority} className="capitalize">
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter || pickupCityFilter || destinationCityFilter || priorityFilter) && (
          <div className="flex flex-wrap gap-2 text-sm mb-2">
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
            {pickupCityFilter && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Pickup: {pickupCityFilter}
              </span>
            )}
            {destinationCityFilter && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Destination: {destinationCityFilter}
              </span>
            )}
            {priorityFilter && (
              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded capitalize">
                Priority: {priorityFilter}
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredDeliveries.length} of {deliveries.length} shipments
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">S/N</th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('trackingNumber')}
              >
                Tracking # {getSortIndicator('trackingNumber')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('customerName')}
              >
                Customer {getSortIndicator('customerName')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('pickupAddress.city')}
              >
                Pickup {getSortIndicator('pickupAddress.city')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('destinationAddress.city')}
              >
                Destination {getSortIndicator('destinationAddress.city')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status {getSortIndicator('status')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('estimatedDeliveryDate')}
              >
                Est. Delivery {getSortIndicator('estimatedDeliveryDate')}
              </th>
              <th 
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('priority')}
              >
                Priority {getSortIndicator('priority')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                  {deliveries.length === 0 ? "No shipments assigned" : "No shipments match your filters."}
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((delivery, index) => {
                const sn = (page - 1) * limit + index + 1;

                return (
                  <tr
                    key={delivery._id.toString()}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <td className="py-3 px-4">{sn}</td>
                    <td className="px-4 py-2 border-b text-sm font-mono">{delivery.trackingNumber}</td>
                    <td className="px-4 py-2 border-b text-sm">
                      <div>{delivery.customerName}</div>
                      <div className="text-gray-500 text-xs">{delivery.customerPhone}</div>
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      {delivery.pickupAddress.city}, {delivery.pickupAddress.state}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      {delivery.destinationAddress.city}, {delivery.destinationAddress.state}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[delivery.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {delivery.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      {new Date(delivery.estimatedDeliveryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b text-sm capitalize">{delivery.priority}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-3 items-center">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded border ${
            page <= 1 || loading
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-[#cf1112] text-[#cf1112] hover:bg-[#b50e0f] hover:text-white"
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
              : "border-[#cf1112] text-[#cf1112] hover:bg-[#b50e0f] hover:text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Shipment Details</h2>
            <p><strong>Tracking #:</strong> {selectedDelivery.trackingNumber}</p>
            <p><strong>Customer:</strong> {selectedDelivery.customerName} ({selectedDelivery.customerPhone})</p>
            <p><strong>Pickup:</strong> {selectedDelivery.pickupAddress.city}, {selectedDelivery.pickupAddress.state}</p>
            <p><strong>Destination:</strong> {selectedDelivery.destinationAddress.city}, {selectedDelivery.destinationAddress.state}</p>
            <p><strong>Status:</strong> {selectedDelivery.status}</p>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => updateStatus(selectedDelivery._id.toString(), "in_transit")}
                disabled={updatingId === selectedDelivery._id.toString()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
              >
                In Transit
              </button>
              <button
                onClick={() => updateStatus(selectedDelivery._id.toString(), "cancelled")}
                disabled={updatingId === selectedDelivery._id.toString()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(selectedDelivery._id.toString(), "delivered")}
                disabled={updatingId === selectedDelivery._id.toString()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Delivered
              </button>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="border border-gray-300 px-4 py-2 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverShipmentTable;