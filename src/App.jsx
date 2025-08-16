import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SalesReport from "./pages/SalesReport";
import PurchaseReport from "./pages/PurchaseReport";
import StockReport from "./pages/StockReport";
import ExpiryReport from "./pages/ExpiryReport";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ItemsList from "./pages/ItemsList";
import Login from "./pages/LogIn";
import ProtectedRoute from "./component/ProtectedRoute";


import SidebarLayout from "./component/SidebarLayout";
import Orders from "./pages/Orders";

import SideBar from "./component/SideBar";

export default function App() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
          <Route path="/sales" element={<SalesReport />} />
          <Route path="/purchase" element={<PurchaseReport />} />
          <Route path="/stock" element={<StockReport />} />
          <Route path="/expiry" element={<ExpiryReport />} />
          <Route path="/user" element={<UserManagement />} />
        </Route>
        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
