import { createContext, useContext, useState, useEffect, use } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isSeller, setSeller] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false); // NEW: global loading
  const [toast, setToast] = useState(null); // NEW: global toast
  const [theme, setTheme] = useState("light"); // NEW: theme toggle
  const navigate = useNavigate();

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

  // // ✅ Medicines fetch from API
  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     setLoading(true);
  //     try {
  //       const { data } = await axios.get("/api/orders");
  //       setMedicines(data);
  //     } catch (err) {
  //       setToast({ type: "error", message: "Error fetching medicines" });
  //       console.error("❌ Error fetching medicines:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMedicines();
  // }, []);

useEffect(() => {
    const fetchItem = async () =>{
    try {
      const {data} = await axios.get("/api/item");
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }
  fetchItem();
},[]
)

  // NEW: Theme toggle
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setSeller,
    menuItems,
    logout,
    axios,
    medicines,
    setMedicines,
    loading, // NEW
    setLoading, // NEW
    toast, // NEW
    setToast, // NEW
  
    theme, // NEW
    setTheme, // NEW
    toggleTheme, // NEW 
    items,
  };

  return (
    <AppContext.Provider value={value}>
      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: toast.type === "error" ? "#fee2e2" : "#bbf7d0",
            color: toast.type === "error" ? "#b91c1c" : "#166534",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {toast.message}
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
