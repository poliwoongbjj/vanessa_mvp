import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditStudent from "./EditStudent";

export default function Student() {
  //this component will fetch the data for a single student
  // get student by id
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const getStudents = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Makes payment table information readable for the user
  const formatPayment = (payment) => {
    if (!payment || !payment.due_date) return "No payment data available";
    // Handle null cases like after you add a student and there is no payment info, everything is null
    //if this isn't here, Payment due_date will automatically be set to December 31

    const dueDate = new Date(payment.due_date);
    const month = dueDate.toLocaleString("en-US", { month: "long" }); // Gets full month name
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

  // FUNCTION TO GET DUE DATE (FIRST OF FOLLOWING MONTH)
  const getNextMonthFirstDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1)
      .toISOString()
      .split("T")[0];
  };

  // BUTTON WILL ADD PAYMENT WITH DUE DATE OF FIRST OF FOLLOWING MONTH
  const addPayment = async (id) => {
    const newPayment = {
      due_date: getNextMonthFirstDate(),
    };

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPayment),
      });
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      const response = await fetch(`/api/students/payments/${paymentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudent(updatedStudent);
      } else {
        alert("Error deleting payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const deleteStudent = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/students");
      } else {
        alert("Error deleting student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (isEditing && student) {
    return (
      <EditStudent
        student={student}
        setStudent={setStudent}
        setIsEditing={setIsEditing}
      />
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
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => addPayment(student.id)}
                  >
                    Add Payment
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Student
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={deleteStudent}
                  >
                    Delete Student
                  </button>
                </div>
              </div>
              <div className="border-bottom mb-3"></div>
              {student.payments.map((payment) => (
                <div
                  key={payment.payment_id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <p className="fs-5 mb-0">{formatPayment(payment)}</p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deletePayment(payment.payment_id)}
                  >
                    Delete Payment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
