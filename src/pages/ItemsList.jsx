import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddItem from '../component/Item';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: '', quantity: '' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get('https://surya-backend-sepia.vercel.app/api/item');
        setItems(res.data);
      } catch (err) {
        setItems([]);
      }
    }
    fetchItems();
  }, []);

  // Optionally, refresh items after adding
  const handleItemAdded = () => {
    setShowAdd(false);
    // Re-fetch items
    axios.get('https://surya-backend-sepia.vercel.app/api/item').then(res => setItems(res.data));
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`https://surya-backend-sepia.vercel.app/api/item/${id}`, editForm);
      setItems(items.map(item => item._id === id ? { ...item, ...editForm } : item));
      setEditId(null);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };
   
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`https://surya-backend-sepia.vercel.app/api/item/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h3 className="text-3xl font-bold mb-8 text-center text-indigo-700">Items List</h3>
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          Add Item
        </button>
      </div>
      {showAdd && (
        <div className="mb-8">
          <AddItem onItemAdded={handleItemAdded} />
          <div className="flex justify-end mt-2">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-gray-500 text-center">No items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={item._id || idx} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between">
              {editId === item._id ? (
                <form className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input className="w-full px-3 py-2 border rounded-lg" name="name" value={editForm.name} onChange={handleEditChange} />
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg" name="description" value={editForm.description} onChange={handleEditChange} />
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input className="w-full px-3 py-2 border rounded-lg" name="price" type="number" value={editForm.price} onChange={handleEditChange} />
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input className="w-full px-3 py-2 border rounded-lg" name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} />
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input className="w-full px-3 py-2 border rounded-lg" name="category" value={editForm.category} onChange={handleEditChange} />
                  <div className="flex gap-2 mt-2">
                    <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => handleEditSave(item._id)}>Save</button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  <h4 className="text-xl font-bold text-indigo-600 mb-2">{item.name}</h4>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Category: {item.category}</span>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Price: ₹{item.price}</span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Qty: {item.quantity}</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemsList;
