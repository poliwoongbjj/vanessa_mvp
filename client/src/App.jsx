import { Routes, Route } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import Students from "./components/Students"
import Page404 from "./components/Page404"
import Navbar from "./components/Navbar";
import Student from "./components/Student";
import "./App.css";



function App() {
  
  return (
    <div>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<AddStudent />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<Student />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  )
}

export default App
