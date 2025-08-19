// Orders.jsx
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const { axios, navigate } = useAppContext();

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from /api/orders');
      const response = await axios.get("/api/orders");
      console.log('Orders response:', response);
      console.log('Orders data:', response.data);
      
      // Extract orders from the response object (similar to items API)
      const data = response.data.orders || response.data || [];
      console.log('Extracted orders:', data);
      console.log('Setting orders:', data.length, 'orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      console.error('Error details:', err.response?.data || err.message);
      setOrders([]);
    }
  };

  const viewInvoice = (orderId) => {
    window.open(`/orders/${orderId}/invoice`, "_blank");
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by search
  const filteredOrders = orders.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber?.toString().includes(search)
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => navigate("/orders/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Total Bill</th>
              <th className="p-3">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-semibold">{o.orderNumber}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{o.customerPhone}</td>
                <td className="p-3 font-bold text-green-600">₹{o.totalAmount}</td>
                <td className="p-3">
                  <button
                    onClick={() => viewInvoice(o._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => paginate(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}