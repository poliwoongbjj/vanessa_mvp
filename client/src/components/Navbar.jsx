import { Link } from "react-router-dom";


export default function Navbar() {
    return (
        <div>

<div className="container">
    <header className="
    d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <Link to="/"  className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <img
          src="/GuitarJoeLogo.JPG"
          alt="Guitar Joe's Music School Logo"
          width="80"
          className="me-3"
        />
        <span className="fs-4">Guitar Joe's Payment Tracker</span>
      </Link>

      <ul className="nav nav-pills d-flex align-items-center">
        <li className="nav-item">
          <Link to="/" className="nav-link active" aria-current="page">
            Add Student
            </Link>
            </li>

        <li className="nav-item">
          <Link to="/students" className="nav-link">
            Student Dashboard
            </Link>
            </li>
      </ul>
    </header>
  </div>

      </div>
    )
}