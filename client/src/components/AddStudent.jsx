import { useState } from "react";

export default function AddStudent () {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        tuition: "",
        enrolled: null,
        instrument:null,
    });

    function handleChange (event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: name === "enrolled"
                ? (value === "Yes") // convert "yes" to true, "no" to false
                 : name === "tuition" ? parseFloat(value) || "" // Keep tuition as a number
                : value,
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        addStudent();
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            tuition: "",
            enrolled: null,
            instrument:null,
        });
    }

    const addStudent = async () => {
        try {
          //POST request
          const response = await fetch("api/students", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

          if (response.ok) {
            alert("Student added successfully!");
          } else {
            alert("Error adding student.");
          }
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div>    
        <div id="add-student-form" className="container mb-5">

        {/* FORM */}
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12 shadow"> {/* Limits width on large screens */}
 
        {/* Header */}
        <h2 className="mt-2">Add Student</h2>
        <div className="border-bottom mb-3"></div>


        {/* First name */}
        <form onSubmit={e => handleSubmit(e)}>
        <div className="row g-3">
          <div className="col-sm-6">
            <label htmlFor="firstName" className="form-label">First name</label>
              <input 
                type="text" 
                className="form-control" 
                id="firstName" 
                name="first_name"
                placeholder="" 
                value={formData.first_name} 
                onChange={e => handleChange(e)}
                required="" />
              <div className="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            {/* Last name */}
            <div className="col-sm-6">
              <label htmlFor="lastName" className="form-label">Last name</label>
              <input 
                type="text" 
                className="form-control" 
                id="lastName" 
                name="last_name"
                placeholder="" 
                value={formData.last_name} 
                onChange={e => handleChange(e)}
                required="" />
              <div className="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            {/* email */}
            <div className="col-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email"
                placeholder=""
                value={formData.email}
                onChange={e => handleChange(e)}
                required=""
                />
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>

            {/* phone */}
            <div className="col-12">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                id="phone" 
                name="phone"
                placeholder="123-456-7890" 
                required=""
                value={formData.phone}
                onChange={e => handleChange(e)}
                />
              <div className="invalid-feedback">
                Please enter a valid phone number.
              </div>
            </div>

            {/* Tuition */}
            <div className="col-12">
              <label htmlFor="tuition" className="form-label">Tuition</label>
              <input 
                type="number" 
                className="form-control" 
                id="tuition" 
                name="tuition"
                placeholder="0.00" 
                step="20.00"
                required=""
                value={formData.tuition}
                onChange={e => handleChange(e)} 
                 />
            </div>

            {/* Instrument */}
            <div className="col-md-6">
              <label htmlFor="instrument" className="form-label">Instrument</label>
              <select 
                className="form-select" 
                id="instrument" 
                name="instrument"
                required=""
                value={formData.instrument}
                onChange={e => handleChange(e)}
                >
                <option value="">Choose...</option>
                <option value="guitar">Guitar</option>
                <option value="drums">Drums</option>
                <option value="piano">Piano</option>
                <option value="accordion">Accordion</option>
              </select>
              <div className="invalid-feedback">
                Please select an instrument.
              </div>
            </div>

            {/* Enrollment status */}
            <div className="col-md-6">
              <label htmlFor="enrollment-status" className="form-label">Currently Enrolled</label>
              <select 
                className="form-select" 
                id="enrollment-status" 
                name="enrolled"
                required=""
                value={formData.enrolled === null ? "" : formData.enrolled ? "Yes" : "No"}
                onChange={e => handleChange(e)}
                >
                <option value="">Choose...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <div className="invalid-feedback">
                Please select yes or no.
              </div>
            </div>

            {/* Submit Button */}
                <div className="col-12 mb-2">
                <button type="submit" className="btn btn-primary">Submit</button>
                </div>

          </div>
        </form>
        </div>
        </div>
        </div>
        </div>
    )
}