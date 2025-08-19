import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  let { user, setUser } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("user");
      if (stored && typeof setUser === "function") {
        setUser(JSON.parse(stored));
      }
    }
  }, [user, setUser]);

  // Check localStorage for immediate redirect decision
  const storedUser = !user ? localStorage.getItem("user") : null;
  const hasUser = user || storedUser;

  if (!hasUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}