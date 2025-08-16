import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSeller, setSeller] = useState(false);

  // Sidebar menu items context me de diye
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Sales Report", path: "/sales" },
    { name: "Purchase Report", path: "/purchase" },
    { name: "Stock Report", path: "/stock" },
    { name: "Expiry Report", path: "/expiry" },
    { name: "User Management", path: "/users" },
  ];

  // Logout function
  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    setUser,
    isSeller,
    setSeller,
    menuItems,
    logout,
    axios    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
