import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    item: "",
    qty: "",
    status: "Pending",
  });

  // 🔹 Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Create new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/orders", formData);
      setFormData({ customer: "", item: "", qty: "", status: "Pending" });
      fetchOrders(); // refresh orders
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  // 🔹 Download invoice
  const downloadInvoice = async (id) => {
    try {
      const response = await axios.get(`/api/orders/${id}/invoice`, {
        responseType: "blob", // file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading invoice:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {/* 🔹 Add Order Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6 flex gap-4"
      >
        <input
          type="text"
          placeholder="Customer Name"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Item"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.qty}
          onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
          className="border p-2 rounded w-32"
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="border p-2 rounded w-40"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Order
        </button>
      </form>

      {/* 🔹 Orders Table */}
      <table className="w-full bg-white rounded-lg shadow-md border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Item</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3">{order.item}</td>
              <td className="p-3">{order.qty}</td>
              <td className="p-3">{order.status}</td>
              <td className="p-3">
                <button
                  onClick={() => downloadInvoice(order.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
