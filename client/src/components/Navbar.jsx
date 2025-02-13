import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div>
        <Link to="/">Add Student</Link>
        <Link to="/students">Student List</Link>
      </div>
    )
}