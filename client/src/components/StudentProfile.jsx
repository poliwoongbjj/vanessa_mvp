import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const { data } = await axios(`/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudent(data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          setError(
            "You don't have permission to view this student's information"
          );
        } else if (err.response?.status === 404) {
          setError("Student not found");
        } else {
          setError("Error loading student data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // Makes payment table information readable for the user
  const formatPayment = (payment) => {
    if (!payment || !payment.due_date) return "No payment data available";

    const dueDate = new Date(payment.due_date);
    const month = dueDate.toLocaleString("en-US", { month: "long" });
    return payment.is_paid
      ? `${month} - ✅ PAID on ${new Date(
          payment.payment_date
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}`
      : `${month} - ❌ NOT PAID`;
  };

  // Function to get due date (first of following month)
  const getNextMonthFirstDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1)
      .toISOString()
      .split("T")[0];
  };

  // Button will add payment with due date of first of following month
  const addPayment = async () => {
    const newPayment = {
      due_date: getNextMonthFirstDate(),
    };

    try {
      const { data } = await axios(`/api/students/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: newPayment,
      });
      setStudent(data);
    } catch (err) {
      console.error(err);
      setError("Failed to add payment");
    }
  };

  // Mark payment as paid
  const markAsPaid = async (paymentId) => {
    const paidPayment = {
      payment_date: new Date().toLocaleDateString("sv-SE"),
    };

    try {
      const { data } = await axios(`/api/students/check/unpaid/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: paidPayment,
      });

      // If response contains updated student data (for student users)
      if (data.first_name) {
        setStudent(data);
      } else {
        // Refresh the student data to get updated payment info
        const response = await axios(`/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudent(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to mark payment as paid");
    }
  };

  // Delete payment (admin only)
  const deletePayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      const { data } = await axios(`/api/students/payments/${paymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudent(data);
    } catch (err) {
      console.error(err);
      setError("Failed to delete payment");
    }
  };

  // Delete student (admin only)
  const deleteStudent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    )
      return;

    try {
      await axios(`/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/students");
    } catch (err) {
      console.error(err);
      setError("Failed to delete student");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-4 mt-2">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          {student && (
            <div className="py-3 px-3 shadow">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="mb-0">{`${student.first_name} ${student.last_name}: Payment History`}</h2>
                <div>
                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={addPayment}
                      >
                        Add Payment
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => navigate(`/students/${id}/edit`)}
                      >
                        Edit Student
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={deleteStudent}
                      >
                        Delete Student
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="border-bottom mb-3"></div>
              {student.payments.length === 0 ? (
                <p>No payment history found.</p>
              ) : (
                student.payments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <p className="fs-5 mb-0">{formatPayment(payment)}</p>
                    <div>
                      {!payment.is_paid && (
                        <button
                          className="btn btn-outline-success btn-sm me-2"
                          onClick={() => markAsPaid(payment.payment_id)}
                        >
                          Mark as Paid
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deletePayment(payment.payment_id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
