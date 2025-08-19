import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

export default function AddItem({ onItemAdded }) {
    const { axios } = useAppContext();
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        category: "",
        description: "",
        stock: 0,
        unit:""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.price || !formData.category || !formData.stock || !formData.description.trim()) {
            toast.error("Please fill all required fields!");
            console.log("Form data is invalid:", formData); // Debug form data
            return;
        }

        if (formData.price <= 0 || formData.stock <= 0) {
            toast.error("Price and quantity must be greater than 0!");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                category: Number(formData.category),
                description: formData.description,
                stock: Number(formData.stock),
                unit: formData.unit
            };
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/item`, payload);
            console.log('Success response:', response.data);
            toast.success("Item added successfully!");

            // Reset form
            setFormData({
                name: "",
                price: 0,
                category: "",
                description: "",
                stock: 0,
            });
            if (typeof onItemAdded === "function") onItemAdded();
        } catch (err) {
            console.error("Item creation error:", err.response?.data || err.message);
            if (err.response?.status === 500) {
                toast.error("Backend server error. Please contact the administrator or try again later.");
            } else {
                toast.error(err.response?.data?.message || "Failed to add item");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
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
                        <label className="block text-gray-700 font-medium">Unit</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="Enter unit"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Enter stock"
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
                            <option value="2">Surya Optical</option>
                            <option value="1">Surya Medical</option>
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
