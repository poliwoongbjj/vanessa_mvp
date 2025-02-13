import { useState } from "react";

export default function Home() {
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
        <div className="container my-3">
         <h2>Add Student</h2>
     
        <form onSubmit={e => handleSubmit(e)}>
        <div class="row g-3">
            <div class="col-sm-6">
              <label for="firstName" class="form-label">First name</label>
              <input 
                type="text" 
                class="form-control" 
                id="firstName" 
                name="first_name"
                placeholder="" 
                value={formData.first_name} 
                onChange={e => handleChange(e)}
                required="" />
              <div class="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Last name</label>
              <input 
                type="text" 
                class="form-control" 
                id="lastName" 
                name="last_name"
                placeholder="" 
                value={formData.last_name} 
                onChange={e => handleChange(e)}
                required="" />
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                name="email"
                placeholder=""
                value={formData.email}
                onChange={e => handleChange(e)}
                required=""
                />
              <div class="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>

            <div class="col-12">
              <label for="phone" class="form-label">Phone Number</label>
              <input 
                type="text" 
                class="form-control" 
                id="phone" 
                name="phone"
                placeholder="123-456-7890" 
                required=""
                value={formData.phone}
                onChange={e => handleChange(e)}
                />
              <div class="invalid-feedback">
                Please enter a valid phone number.
              </div>
            </div>

            <div class="col-12">
              <label for="tuition" class="form-label">Tuition</label>
              <input 
                type="number" 
                class="form-control" 
                id="tuition" 
                name="tuition"
                placeholder="0.00" 
                step="20.00"
                required=""
                value={formData.tuition}
                onChange={e => handleChange(e)} 
                 />
            </div>

            <div class="col-md-6">
              <label for="instrument" class="form-label">Instrument</label>
              <select 
                class="form-select" 
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
              <div class="invalid-feedback">
                Please select an instrument.
              </div>
            </div>

            <div class="col-md-6">
              <label for="enrollment-status" class="form-label">Currently Enrolled</label>
              <select 
                class="form-select" 
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
              <div class="invalid-feedback">
                Please select yes or no.
              </div>
            </div>
                <div className="col-12">
                <button type="submit" className="btn btn-primary">Submit</button>
                </div>

          </div>
            
        </form>
        </div>
        </div>
    )
}