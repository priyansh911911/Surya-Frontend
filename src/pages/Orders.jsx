import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
const {axios} = useAppContext();
  const [form, setForm] = useState({
    orderNumber: "",
    customerName: "",
    customerPhone: "",
    discount: 0,
    tax: 0,
    items: [
      { itemId: "", itemName: "", category: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
    ],
  });

  // --- helpers ---
  const recalcItem = (item) => ({
    ...item,
    totalPrice: Number(item.quantity || 0) * Number(item.unitPrice || 0),
  });

  const orderSubtotal = useMemo(
    () => form.items.reduce((sum, it) => sum + Number(it.totalPrice || 0), 0),
    [form.items]
  );

  const orderTotal = useMemo(() => {
    const sub = orderSubtotal;
    const afterDiscount = sub - (sub * Number(form.discount || 0)) / 100;
    const afterTax = afterDiscount + (afterDiscount * Number(form.tax || 0)) / 100;
    return Math.max(0, Math.round(afterTax));
  }, [orderSubtotal, form.discount, form.tax]);

  // --- fetch all orders ---
  const fetchOrders = async () => {
    try {
      setError("");
      const { data } = await axios.get("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to fetch orders");
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- form actions ---
  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    const updated = { ...items[idx], [field]: value };
    items[idx] = recalcItem(updated);
    setForm((f) => ({ ...f, items }));
  };

  const addItemRow = () => {
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { itemId: "", itemName: "", category: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
    }));
  };

  const removeItemRow = (idx) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  // --- submit create order ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate minimum fields (most backends need itemId & quantity > 0)
    const invalid = form.items.some(
      (it) => !it.itemId || Number(it.quantity) <= 0 || Number(it.unitPrice) < 0
    );
    if (!form.customerName || !form.customerPhone || invalid) {
      setError("Please fill all required fields (customer, phone, each item needs itemId, quantity > 0).");
      return;
    }

    // Build payload exactly like schema
    const payload = {
      orderNumber: String(form.orderNumber || "").trim(),
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      discount: Number(form.discount || 0),
      tax: Number(form.tax || 0),
      items: form.items.map((it) => ({
        itemId: it.itemId.trim(),            // 🔴 usually required
        itemName: it.itemName.trim(),
        category: it.category.trim(),        // optional if backend allows
        quantity: Number(it.quantity || 0),
        unitPrice: Number(it.unitPrice || 0),
        totalPrice: Number(it.totalPrice || 0),
      })),
    };

    try {
      await axios.post("/api/orders", payload);
      // reset
      setForm({
        orderNumber: "",
        customerName: "",
        customerPhone: "",
        discount: 0,
        tax: 0,
        items: [{ itemId: "", itemName: "", category: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
      });
      await fetchOrders();
      // Optional: toast/alert
      // alert("Order created successfully ✅");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Failed to create order";
      setError(msg);
      console.error("Create Order Error:", e?.response?.data || e);
    }
  };

  // --- invoice download ---
  const downloadInvoice = async (id) => {
    try {
      const res = await axios.get(`/api/orders/${id}/invoice`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError("Failed to download invoice");
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Create Order */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border rounded p-2"
            placeholder="Order Number (e.g., 006)"
            value={form.orderNumber}
            onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            placeholder="Customer Name *"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Customer Phone *"
            value={form.customerPhone}
            onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm w-24">Discount %</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              min="0"
              value={form.discount}
              onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm w-24">Tax %</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              min="0"
              value={form.tax}
              onChange={(e) => setForm((f) => ({ ...f, tax: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Items</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-2">
            {form.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                <input
                  className="border rounded p-2"
                  placeholder="Item ID *"
                  value={it.itemId}
                  onChange={(e) => updateItem(idx, "itemId", e.target.value)}
                  required
                />
                <input
                  className="border rounded p-2"
                  placeholder="Item Name"
                  value={it.itemName}
                  onChange={(e) => updateItem(idx, "itemName", e.target.value)}
                />
                <input
                  className="border rounded p-2"
                  placeholder="Category (e.g., Surya Medical)"
                  value={it.category}
                  onChange={(e) => updateItem(idx, "category", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded p-2"
                  placeholder="Qty"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                  required
                />
                <input
                  type="number"
                  className="border rounded p-2"
                  placeholder="Unit Price"
                  min="0"
                  value={it.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">₹{it.totalPrice || 0}</span>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 pt-2">
          <div className="text-sm">Subtotal: <b>₹{orderSubtotal}</b></div>
          <div className="text-sm">Total (after discount & tax): <b>₹{orderTotal}</b></div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
            Create Order
          </button>
        </div>
      </form>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Items</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Tax</th>
              <th className="p-3">Created</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="p-3 text-center" colSpan={8}>No orders found</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3">{o.orderNumber}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">{o.customerPhone}</td>
                  <td className="p-3">
                    <div className="space-y-1">
                      {o.items?.map((i) => (
                        <div key={i._id}>
                          {i.itemName} ({i.quantity} × ₹{i.unitPrice}) = ₹{i.totalPrice}
                          {i.category ? ` — ${i.category}` : ""}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{o.discount}%</td>
                  <td className="p-3">{o.tax}%</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => downloadInvoice(o._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
