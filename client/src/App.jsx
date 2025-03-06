import { Routes, Route } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import Students from "./components/Students";
import Student from "./components/Student";
import EditStudent from "./components/EditStudent";
import Page404 from "./components/Page404";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public routes */}

        {/* Protected routes for any authenticated user */}
        <Route path="/students/:id" element={<Student />} />

        {/* Admin-only routes */}
        <Route path="/" element={<AddStudent />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id/edit" element={<EditStudent />} />

        {/* 404 route */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
