import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

// Category mapping function
const getCategoryText = (categoryNumber) => {
  return categoryNumber === 1 ? 'Surya Medical' : categoryNumber === 2 ? 'Surya Optical' : categoryNumber;
};

function ItemsList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState('Both');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const {axios} = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 25;

  useEffect(() => {
    fetchItems();
    
    // Refresh when window gains focus (when returning from edit)
    const handleFocus = () => fetchItems();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Refresh items when returning from edit
  useEffect(() => {
    if (location.state?.refresh) {
      fetchItems();
      // Clear the refresh state to prevent multiple refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function fetchItems() {
      try {
        const res = await axios.get('/api/item');
        setItems(res.data);
      } catch (err) {
        setItems([]);
      }
    }

  useEffect(() => {
    let filtered = items;
    
    // Filter by category
    if (sortBy !== 'Both') {
      filtered = filtered.filter(item => 
        item.category && item.category.toString() === sortBy
      );
    }
    
    setFilteredItems(filtered);
  }, [items, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const handleEditClick = (item) => {
    navigate(`/items/edit/${item._id}`, { state: { item } });
  };


   
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeletingId(id);
    try {
      console.log('Deleting item with id:', id);
      await axios.delete(`/api/item/${id}`);
      setItems(items.filter(item => item._id !== id));
      fetchItems();
      toast.success('Item deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      const errorMsg = err?.response?.data?.message || 'Failed to delete item';
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h3 className="text-3xl font-bold mb-8 text-center text-indigo-700">Items List</h3>
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2 print:hidden">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Both">Both</option>
            <option value="2">Surya Opticals</option>
            <option value="1">Surya Medicals</option>
          </select>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/items/add')}
        >
          Add Item
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-gray-500 text-center">No items found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(window.matchMedia && window.matchMedia('print').matches ? filteredItems : currentItems).map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryText(item.category)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock === 0 ? (
                      <span className="text-red-500 font-medium">Out of Stock</span>
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium print:hidden">
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => handleEditClick(item)}>Edit</button>
                      <button 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50" 
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredItems.length > 0 && (
        <div className="flex justify-center items-center mt-6 gap-2 print:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemsList;
