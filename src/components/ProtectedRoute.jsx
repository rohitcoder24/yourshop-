// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === undefined) return <div>Loading...</div>;  // ✅ Prevents crash if `user` is undefined

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
