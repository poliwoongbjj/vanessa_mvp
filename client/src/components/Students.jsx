import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Customers() {
    const [students, setStudents] = useState([]);
    const [unpaidStudents, setUnpaidStudents] = useState([]);
    const [showUnpaid, setShowUnpaid] =useState(false); // Toggle for showing unpaid students
    
    const getStudents = async () => {
        try {
            const response = await fetch("/api/students");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    const getUnpaidStudents = async () => {
        try {
            const response = await fetch ("/api/students/check/unpaid");
            const data = await response.json();
            setUnpaidStudents(data);
            setShowUnpaid(true); // Show unpaid students when fetched
        } catch (error) {
            console.log(error)
        }
    };

    const handleShowUnpaidStudents = event => {
        event.preventDefault();
        getUnpaidStudents();
    }

    const todaysDate = () => new Date().toLocaleDateString("sv-SE");
    
      const markPaid = async (id) => {
        const paidPayment = {
          payment_date: todaysDate()
        };
    
        try{
          const response = await fetch (`/api/students/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(paidPayment)
          });
          const data = await response.json();
          setUnpaidStudents(data);
          getUnpaidStudents();
        } catch (error) {
          console.log(error)
        }
      }

    return (
        <div>Students
            <div>
                {students.map((student) => (
                <Link key={student.id} to={`/students/${student.id}`}>
                    {student.first_name} {student.last_name}{" "}
                </Link>
                ))}
            </div>
            <button onClick={e => handleShowUnpaidStudents(e)}>Upaid Students</button>
            
            {/* Show unpaid students if the button is clicked */}
                {showUnpaid && (
                    <div>
                        <h3>Unpaid Students</h3>
                        <div>
                            <ul>
                        {unpaidStudents.map(student => {
                            // Convert due_date to a readable month
                        const dueMonth = new Date(student.due_date).toLocaleString('en-US', { month: 'long' });

                        return (
                            <div key={student.id}>
                            <li>
                                {student.first_name} {student.last_name} - Due: {dueMonth}
                            <div>
                              <button onClick={() => markPaid()}>Mark as Paid</button>  
                            </div>
                            </li> 
                            </div>
                             );
                            })}
                            </ul>
                        </div>    
                    </div>
                )}
            
        </div>
    )
}