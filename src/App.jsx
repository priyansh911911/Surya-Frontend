import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ItemsList from "./pages/ItemsList";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import Login from "./pages/LogIn";
import ProtectedRoute from "./component/ProtectedRoute";


import SidebarLayout from "./component/SidebarLayout";
import Orders from "./pages/Orders";

import SideBar from "./component/SideBar";

export default function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Login page without sidebar */}
        <Route path="/login" element={<Login />} />
        {/* Protected pages with Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <SideBar />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/items/add" element={<AddItemPage />} />
          <Route path="/items/edit/:id" element={<EditItemPage />} />
          <Route path="/user" element={<UserManagement />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
