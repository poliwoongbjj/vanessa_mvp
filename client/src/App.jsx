import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AddStudent from "./components/AddStudent";
import StudentDashboard from "./components/StudentDashboard";
import StudentProfile from "./components/StudentProfile";
import EditStudent from "./components/EditStudent";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Unauthorized from "./components/Unauthorized";
import Page404 from "./components/Page404";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes for any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/students/:id" element={<StudentProfile />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/" element={<AddStudent />} />
            <Route path="/students" element={<StudentDashboard />} />
            <Route path="/students/:id/edit" element={<EditStudent />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
