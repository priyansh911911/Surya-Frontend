import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddItem from '../component/Item';

function AddItemPage() {
  const navigate = useNavigate();

  const handleItemAdded = () => {
    navigate('/items');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/items')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-4"
        >
          ← Back to Items
        </button>
        <h3 className="text-3xl font-bold text-indigo-700">Add New Item</h3>
      </div>
      <AddItem onItemAdded={handleItemAdded} />
    </div>
  );
}

export default AddItemPage;