import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditStudent() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tuition: "",
    enrolled: false,
    instrument: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios(`/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          tuition: data.tuition,
          enrolled: data.enrolled,
          instrument: data.instrument,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]:
        name === "enrolled"
          ? value === "Yes"
          : name === "tuition"
          ? parseFloat(value) || ""
          : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios(`/api/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: formData,
      });

      setSuccess(true);

      // Redirect back to student profile after short delay
      setTimeout(() => {
        navigate(`/students/${id}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating student.");
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12 shadow">
          <h2 className="mt-2">Edit Student</h2>
          <div className="border-bottom mb-3"></div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              Student updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="tuition" className="form-label">
                  Tuition
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="tuition"
                  name="tuition"
                  value={formData.tuition}
                  onChange={handleChange}
                  step="20.00"
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="instrument" className="form-label">
                  Instrument
                </label>
                <select
                  className="form-select"
                  id="instrument"
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  required
                >
                  <option value="guitar">Guitar</option>
                  <option value="drums">Drums</option>
                  <option value="piano">Piano</option>
                  <option value="accordion">Accordion</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="enrollment-status" className="form-label">
                  Currently Enrolled
                </label>
                <select
                  className="form-select"
                  id="enrollment-status"
                  name="enrolled"
                  value={formData.enrolled ? "Yes" : "No"}
                  onChange={handleChange}
                  required
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={success}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/students/${id}`)}
                  disabled={success}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
