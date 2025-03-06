import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tuition: "",
    enrolled: null,
    instrument: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]:
        name === "enrolled"
          ? value === "Yes" // convert "yes" to true, "no" to false
          : name === "tuition"
          ? parseFloat(value) || "" // Keep tuition as a number
          : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: formData,
      });

      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        tuition: "",
        enrolled: null,
        instrument: null,
      });

      // Redirect to student dashboard after short delay
      setTimeout(() => {
        navigate("/students");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error adding student.");
    }
  }

  return (
    <div>
      <div id="add-student-form" className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12 shadow">
            <h2 className="mt-2">Add Student</h2>
            <div className="border-bottom mb-3"></div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                Student added successfully! Redirecting to dashboard...
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder="123-456-7890"
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
                    placeholder="0.00"
                    step="20.00"
                    value={formData.tuition}
                    onChange={handleChange}
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
                    value={formData.instrument || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose...</option>
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
                    value={
                      formData.enrolled === null
                        ? ""
                        : formData.enrolled
                        ? "Yes"
                        : "No"
                    }
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="col-12 mb-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={success}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
