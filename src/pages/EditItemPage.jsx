import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

function EditItemPage() {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    is_oos: false,
  });

  useEffect(() => {
    if (location.state?.item) {
      setFormData(location.state.item);
    } else {
      toast.error('Item data not found');
      navigate('/items');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('=== UPDATING ITEM ===');
      console.log('Item ID:', id);
      console.log('Form data being sent:', formData);
      console.log('Stock value:', formData.stock, 'Type:', typeof formData.stock);
      console.log('API URL:', `${import.meta.env.VITE_BACKEND_URL}api/item/${id}`);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/item/${id}`, formData);
      
      console.log('=== UPDATE RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      console.log('Updated stock in response:', response.data?.stock);
      
      toast.success('Item updated successfully!');
      navigate('/items', { state: { refresh: true } });
    } catch (err) {
      console.error('=== UPDATE ERROR ===');
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Full error:', err);
      toast.error('Failed to update item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/items')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-4"
        >
          Back to Items
        </button>
        <h3 className="text-3xl font-bold text-indigo-700">Edit Item</h3>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_oos"
                checked={formData.is_oos}
                onChange={(e) => setFormData(prev => ({ ...prev, is_oos: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Out of Stock</span>
            </label>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
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
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItemPage;