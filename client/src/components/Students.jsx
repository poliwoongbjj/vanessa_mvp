import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Customers() {
    const [students, setStudents] = useState([]);
    

    const getStudents = async () => {
        try {
            const response = await fetch("/api/students");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStudents();
    }, []);

    return (
        <div>Students
            <div>
                {students.map((student) => (
                <Link key={student.id} to={`/students/${student.id}`}>
                    {student.first_name} {student.last_name}{" "}
                </Link>
                ))}
            </div>

        </div>
    )
}