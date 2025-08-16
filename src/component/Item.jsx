import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function AddItem({ onItemAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        category: "",
        description: "",
        quantity: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "price" || name === "quantity" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category || !formData.quantity || !formData.description) {
            toast.error("Please fill all required fields!");
            console.log("Form data is invalid:", formData); // Debug form data
            return;
        }

        try {
            console.log("Sending item payload:", formData); // Debug payload
            await axios.post("https://surya-backend-sepia.vercel.app/api/item", formData);
            toast.success("Item added successfully!");

            // Reset form
            setFormData({
                name: "",
                price: 0,
                category: "",
                description: "",
                quantity: 0,
            });
            if (typeof onItemAdded === "function") onItemAdded();
        } catch (err) {
            console.error("Item creation error:", err.response?.data || err.message); // Debug error
            toast.error(err.response?.data?.message || "Failed to add item");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter item name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="">Select category</option>
                            <option value="Surya Opticals">Surya Opticals</option>
                            <option value="Surya Medical">Surya Medical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );
}
