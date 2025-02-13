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

    return (
        <div>
          {student && (
            <div>
          <h3>This is {`${student.first_name} ${student.last_name}'s payment history`}</h3>
          {student.payments.map((payment) => (
            <p key={payment.payment_id}>{payment.due_date} {payment.is_paid} {payment.payment_date}</p>
          ))}
          </div>
          )}  
        </div>
    )
}