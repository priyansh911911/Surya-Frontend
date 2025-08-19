// src/pages/CreateOrder.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import Select from "react-select";

export default function CreateOrder() {
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
<<<<<<< HEAD
  const { axios, loading, setLoading, navigate } = useAppContext();
=======
  const { axios, loading, setLoading, toast, setToast, navigate } = useAppContext();

  // ✅ Category Mapping
  const categoryMap = {
    1: "Surya Medical",
    2: "Surya Optical",
  };
>>>>>>> 6ed8dff8313e9f8fb1cd0260eaa64577f6607c6d

  // Fetch items for the dropdown
  useEffect(() => {
    const fetchItems = async () => {
      try {
<<<<<<< HEAD
        console.log('Fetching items for CreateOrder...');
        const res = await axios.get('/api/item');
        const data = res.data.items || res.data || [];
        console.log('Items for CreateOrder:', data.length);
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
=======
        console.log("Fetching items for CreateOrder...");
        const res = await axios.get("/api/item");
        const data = res.data.items || res.data || [];
        console.log("Items for CreateOrder:", data.length);
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
>>>>>>> 6ed8dff8313e9f8fb1cd0260eaa64577f6607c6d
        setItems([]);
      }
    };
    fetchItems();
  }, [axios]);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    discount: 0,
    tax: 0,
    items: [
      {
        itemId: "",
        itemName: "",
        category: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
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
    const afterTax =
      afterDiscount + (afterDiscount * Number(form.tax || 0)) / 100;
    return Math.max(0, Math.round(afterTax));
  }, [orderSubtotal, form.discount, form.tax]);

  // --- update item ---
  const updateItem = (idx, field, value) => {
    const formItems = [...form.items];
    let updated = { ...formItems[idx], [field]: value };

    if (field === "itemId") {
      const item = items.find((i) => i._id === value);
      if (item) {
        updated.itemName = item.name;
        updated.unitPrice = item.price || 0;
        // ✅ map category
        updated.category = categoryMap[item.category] || item.category || "";
      }
    }

    formItems[idx] = recalcItem(updated);
    setForm((f) => ({ ...f, items: formItems }));
  };

  const addItemRow = () => {
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          itemId: "",
          itemName: "",
          category: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    }));
  };

  const removeItemRow = (idx) => {
    setForm((f) => {
      if (f.items.length === 1) return f;
      return { ...f, items: f.items.filter((_, i) => i !== idx) };
    });
  };

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const invalid = form.items.some(
      (it) =>
        !it.itemId || Number(it.quantity) <= 0 || Number(it.unitPrice) < 0
    );
    if (!form.customerName || !form.customerPhone || invalid) {
      setError("Please fill all required fields.");
<<<<<<< HEAD
      toast.error("Please fill all required fields.");
=======
      setToast &&
        setToast({ type: "error", message: "Please fill all required fields." });
>>>>>>> 6ed8dff8313e9f8fb1cd0260eaa64577f6607c6d
      return;
    }

    const payload = { ...form };

    try {
      setLoading(true);
      await axios.post("/api/orders", payload);
<<<<<<< HEAD
      toast.success("Order created successfully!");
=======
      setToast &&
        setToast({ type: "success", message: "Order created successfully!" });
>>>>>>> 6ed8dff8313e9f8fb1cd0260eaa64577f6607c6d
      navigate("/orders");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to create order";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const itemOptions =
    items?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📝 Create Order</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Customer Name *"
            value={form.customerName}
            onChange={(e) =>
              setForm((f) => ({ ...f, customerName: e.target.value }))
            }
            required
          />
          <input
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Customer Phone *"
            value={form.customerPhone}
            onChange={(e) =>
              setForm((f) => ({ ...f, customerPhone: e.target.value }))
            }
            required
          />
        </div>

        {/* Discount & Tax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Discount %</label>
            <input
              type="number"
              min="0"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              value={form.discount}
              onChange={(e) =>
                setForm((f) => ({ ...f, discount: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Tax %</label>
            <input
              type="number"
              min="0"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              value={form.tax}
              onChange={(e) =>
                setForm((f) => ({ ...f, tax: Number(e.target.value) }))
              }
            />
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">📦 Items</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Add Item
            </button>
          </div>

          {form.items.map((it, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 bg-gray-50 p-3 rounded-lg"
            >
              <Select
                options={itemOptions}
                value={itemOptions.find((opt) => opt.value === it.itemId) || null}
                onChange={(selected) =>
                  updateItem(idx, "itemId", selected.value)
                }
                placeholder="Select Item"
                className="w-full"
              />

              {/* ✅ category mapped from API */}
              <input
                className="border rounded-lg p-2 bg-gray-100"
                value={it.category}
                readOnly
              />

              <input
                type="number"
                min="1"
                className="border rounded-lg p-2"
                value={it.quantity}
                onChange={(e) =>
                  updateItem(idx, "quantity", Number(e.target.value))
                }
              />
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2"
                value={it.unitPrice}
                onChange={(e) =>
                  updateItem(idx, "unitPrice", Number(e.target.value))
                }
              />
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-600">
                  ₹{it.totalPrice}
                </span>
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  disabled={form.items.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex flex-col md:flex-row justify-end gap-6 pt-4 border-t">
          <div className="text-gray-700">
            Subtotal: <b>₹{orderSubtotal}</b>
          </div>
          <div className="text-gray-700">
            Discount ({form.discount}%):{" "}
            <b>-₹{Math.round((orderSubtotal * form.discount) / 100)}</b>
          </div>
          <div className="text-gray-700">
            Tax ({form.tax}%):{" "}
            <b>
              +₹
              {Math.round(
                ((orderSubtotal - (orderSubtotal * form.discount) / 100) *
                  form.tax) /
                  100
              )}
            </b>
          </div>
          <div className="text-gray-900">
            Total:{" "}
            <b className="text-lg text-emerald-600">₹{orderTotal}</b>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            {loading ? "Saving..." : "Save Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
