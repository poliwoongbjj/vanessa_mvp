import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Clear cookies by making a logout request
    fetch("/api/auth/logout", { method: "POST" })
      .catch((err) => console.error("Logout error:", err))
      .finally(() => {
        // Force page reload to clear all state
        window.location.href = "/login";
      });
  };

  return (
    <div>
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
          <Link
            to={
              currentUser
                ? isAdmin
                  ? "/students"
                  : `/students/${currentUser.student_id}`
                : "/login"
            }
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <img
              src="/GuitarJoeLogo.JPG"
              alt="Guitar Joe's Music School Logo"
              width="80"
              className="me-3"
            />
            <span className="fs-4">Guitar Joe's Payment Tracker</span>
          </Link>

          <ul className="nav nav-pills d-flex align-items-center">
            {currentUser ? (
              // Authenticated user navigation
              <>
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        Add Student
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/students" className="nav-link">
                        Student Dashboard
                      </Link>
                    </li>
                  </>
                )}
                {isStudent && (
                  <li className="nav-item">
                    <Link
                      to={`/students/${currentUser.student_id}`}
                      className="nav-link"
                    >
                      My Profile
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {currentUser.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item text-muted">
                        Role: {isAdmin ? "Admin" : "Student"}
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Guest navigation
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </header>
      </div>
    </div>
  );
}
