import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Page404() {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();

  // Determine where to redirect the user based on their role
  const getRedirectLink = () => {
    if (!isAuthenticated) {
      return "/login";
    }

    if (isAdmin) {
      return "/students";
    }

    return `/students/${currentUser.student_id}`;
  };

  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="text-primary mb-4">Page Not Found</h1>
              <div className="display-1 text-secondary mb-4">404</div>
              <p className="lead mb-4">
                The page you are looking for does not exist or has been moved.
              </p>
              <Link to={getRedirectLink()} className="btn btn-primary">
                Return to{" "}
                {isAuthenticated
                  ? isAdmin
                    ? "Dashboard"
                    : "My Profile"
                  : "Login"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
