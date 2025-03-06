import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="text-danger mb-4">Access Denied</h1>
              <div className="display-1 text-warning mb-4">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <p className="lead mb-4">
                You don't have permission to access this page. This area
                requires admin privileges.
              </p>
              <Link to="/students" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
