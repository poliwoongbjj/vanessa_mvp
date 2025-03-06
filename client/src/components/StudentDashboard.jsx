import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [unpaidStudents, setUnpaidStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  const getStudents = async () => {
    try {
      const { data } = await axios("/api/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    }
  };

  const getUnpaidStudents = async () => {
    try {
      const { data } = await axios("/api/students/check/unpaid", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUnpaidStudents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load unpaid student records");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          await Promise.all([getStudents(), getUnpaidStudents()]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const todaysDate = () => new Date().toLocaleDateString("sv-SE");

  const markPaid = async (id) => {
    const paidPayment = {
      payment_date: todaysDate(),
    };

    try {
      const { data } = await axios(`/api/students/check/unpaid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: paidPayment,
      });
      setUnpaidStudents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to mark payment as paid");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          You don't have access to this page. Please contact an administrator.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row gap-4 px-3">
        {/* Left Column - Student List */}
        <div className="col-md-4 py-2">
          <h2>Student List</h2>
          <ul className="list-group ms-2" style={{ maxWidth: "300px" }}>
            {students.map((student) => (
              <li key={student.id} className="list-group-item">
                <Link to={`/students/${student.id}`}>
                  {student.first_name} {student.last_name}{" "}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Unpaid Students */}
        <div className="col-md-6 py-2">
          <div>
            <h2>Students - Unpaid Payments</h2>
            {unpaidStudents.length === 0 ? (
              <p>No unpaid payments found.</p>
            ) : (
              <ul className="list-unstyled">
                {unpaidStudents.map((student) => {
                  // Convert due_date to a readable month
                  const dueMonth = new Date(student.due_date).toLocaleString(
                    "en-US",
                    { month: "long" }
                  );
                  return (
                    <li
                      key={student.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {student.first_name} {student.last_name} - Due: {dueMonth}
                      <button
                        className="btn btn-outline-success btn-sm my-1"
                        onClick={() => markPaid(student.payment_id)}
                      >
                        Mark as Paid
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
