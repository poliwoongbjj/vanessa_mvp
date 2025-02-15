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
          ? `${month} - PAID on ${new Date(payment.payment_date).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`
          : `${month} - NOT PAID`;
  };

  const getNextMonthFirstDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, ).toISOString().split("T")[0];
  }

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
      getStudents();
    } catch (error) {
      console.log(error)
    }
  }


    return (
        <div>
          {student && (
            <div>
          <h3>This is {`${student.first_name} ${student.last_name}'s payment history`}</h3>
          {student.payments.map((payment) => (
            <p key={payment.payment_id}>{formatPayment(payment)}</p>
          ))}
           <button onClick={()=> addPayment(student.id)}>Add Payment</button>
          </div>
          )}  
        </div>
    )
}