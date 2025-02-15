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
          const response = await fetch (`/api/students/check/unpaid/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(paidPayment)
          });
          const data = await response.json();
          setUnpaidStudents(data);
        } catch (error) {
          console.log(error)
        }
      }

    return (
        <div className="container mt-4">
            <div className="row mb-2">
            <div className="col">
                <h2>Student List</h2>
            </div>
             <div className="col">
                <button 
                className="btn btn-outline-danger btn-sm"
                onClick={e => handleShowUnpaidStudents(e)}>
                    Unpaid Students
                    </button>
             </div>
            

            </div>

          
            <div className="row">
             {/* Left Column - Student List */}
             <div className="col-md-5">
            <ul className="list-group ms-2"  style={{ maxWidth: "300px" }}>
                {students.map((student) => (
                <li key={student.id} className="list-group-item">    
                <Link key={student.id} to={`/students/${student.id}`}>
                    {student.first_name} {student.last_name}{" "}
                </Link>
                </li>
                ))}
            </ul>
            
            </div>

            {/* Right Column - Unpaid Students */}
            {/* Show unpaid students if the button is clicked */}
                <div className="col-sm-7">
                {showUnpaid && (
                    <div>
                     <h3>Unpaid Students</h3>
                       <ul className="list-unstyled">
                        {unpaidStudents.map(student => {
                            // Convert due_date to a readable month
                        const dueMonth = new Date(student.due_date).toLocaleString('en-US', { month: 'long' });
                        return (
                            <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {student.first_name} {student.last_name} - Due: {dueMonth}
                            
                              <button 
                                className="btn btn-outline-success btn-sm my-1" 
                                onClick={() => markPaid(student.payment_id)}>
                                Mark as Paid
                                </button>  
                            
                            </li> 
                            
                             );
                            })}
                            </ul>
                            
                    </div>
                )}
                  </div>
            </div>
        </div>
    )
}