import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  let { user, setUser } = useAppContext();
  const location = useLocation();

  // Fallback: If user is null but localStorage has user, rehydrate context
  if (!user) {
    const stored = localStorage.getItem("user");
    if (stored) {
      user = JSON.parse(stored);
      if (typeof setUser === "function") setUser(user);
    }
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}