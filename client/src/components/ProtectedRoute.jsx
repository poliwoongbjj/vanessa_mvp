import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If admin only route and user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  // If all checks pass, render the children
  return <Outlet />;
}
