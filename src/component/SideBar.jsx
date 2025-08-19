import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, FileText, ShoppingCart, Package, AlertTriangle, LogOut, Users } from "lucide-react";
import { useAppContext } from "../context/AppContext"; // Apne context ka path adjust karna

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const menuItems = [
    { name: "User Management", path: "/user", icon: <Users size={16} /> },
    { name: "Dashboard", path: "/", icon: <Home size={16} /> },
    { name: "Items List", path: "/items", icon: <Package size={16} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={16} /> },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 p-5 shadow-lg relative flex flex-col print:hidden">
      {/* Title */}
      <h1 className="text-lg font-bold tracking-wide mb-6">
        Surya Medical And Optical
      </h1>
      {/* Menu */}
      <ul className="space-y-1 flex-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-300 
                  ${isActive ? "bg-blue-600 shadow-md" : "hover:bg-gray-700 hover:pl-4"}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Logout bottom-right */}
      <div className="absolute bottom-5 right-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full text-sm transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        </div>
      </div>
      {/* Main content for nested routes */}
      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
