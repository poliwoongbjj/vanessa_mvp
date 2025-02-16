import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Student () {
    //this component will fetch the data for a single student
    // get student by id
    const [student, setStudent] = useState(null);
    const { id } = useParams();

    const getStudents = async () => {
        try {
            const response = await fetch(`/api/students/${id}`);
            const data = await response.json();
            setStudent(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStudents();
    }, []);

    const formatPayment = (payment) => {
      if (!payment || !payment.due_date) return "No payment data available"; // Handle null cases
      
      const dueDate = new Date(payment.due_date);
      const month = dueDate.toLocaleString("en-US", { month: "long" }); // Gets full month name
      return payment.is_paid
          ? `${month} - ✅ PAID on ${new Date(payment.payment_date).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`
          : `${month} - ❌ NOT PAID`;
  };

  // FUNCTION TO GET DUE DATE (FIRST OF FOLLOWING MONTH)
  const getNextMonthFirstDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, ).toISOString().split("T")[0];
  }


  // BUTTON WILL ADD PAYMENT WITH DUE DATE OF FIRST OF FOLLOWING MONTH
  const addPayment = async (id) => {
    const newPayment = {
      due_date: getNextMonthFirstDate()
    };

    try{
      const response = await fetch (`/api/students/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPayment)
      });
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.log(error)
    }
  }

    return (
        <div className="container mx-4 mt-2">
          <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">

          {student && (
            <div className="py-3 px-3 shadow">
              <div className="d-flex align-items-center justify-content-between">
          <h2 className="mb-0">{`${student.first_name} ${student.last_name} Payment History`}</h2>
          <button className="btn btn-primary btn-sm ms-3 mb-1" onClick={()=> addPayment(student.id)}>Add Payment</button>
          </div>
          <div className="border-bottom mb-3"></div>
          {student.payments.map((payment) => (
            <p key={payment.payment_id} className="fs-5">{formatPayment(payment)}</p>
          ))}
          
          </div>
          )}  
          </div>
          </div>
        </div>
    )
}