var express = require('express');
var router = express.Router();
const db = require("../model/helper");

// all the routes start with /api/students because that is what is in the app.js

// GET all students
// "/api/students"
router.get("/", async (req, res, next) => {
  // question, when do we need to use "next"
  try {
    const results = await db("SELECT * FROM students ORDER BY first_name;");
    res.send(results.data);
  } catch (error) {
    console.log(error);
  }
});

const treatStudentData = (data) => {
  const response = {
    id: data[0].id,
    first_name: data[0].first_name,
    last_name: data[0].last_name,
    email: data[0].email,
    phone: data[0].phone,
    tuition: data[0].tuition,
    enrolled: data[0].enrolled,
    payments: []
  }

  data.forEach((payment) => {
    response.payments.push({
      due_date: payment.due_date,
      payment_date: payment.payment_date,
      is_paid: payment.is_paid,
      payment_id: payment.payment_id
    });
  });

  return response;
}


// GET single student and include payment info
// "/api/students/:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await db (
      `SELECT students.*, 
      DATE_FORMAT(payments.due_date, '%M %d %Y') AS due_date,
      DATE_FORMAT(payments.payment_date,'%M %d %Y') AS payment_date,
      payments.is_paid, 
      payments.id AS payment_id 
      FROM students 
      LEFT JOIN payments ON students.id = payments.student_id 
      WHERE students.id = ${id};`);

    const student = treatStudentData(results.data);
    res.send(student);
  } catch (error) {
    console.log(error);
  }
});

// GET unpaid students
// "/api/students/unpaid"
router.get('/check/unpaid', async (req, res, next) => {
  // console.log("*** Entering unpaid ***");
  try {
    const results = await db (`SELECT students.id, students.first_name, students.last_name, payments.id AS payment_id, payments.due_date, payments.payment_date
    FROM students
    JOIN payments ON students.id = payments.student_id
     WHERE payments.is_paid = 0
     ORDER BY students.first_name ASC;`);
      console.log("Unpaid students:", results.data);
    res.send(results.data);
  } catch (error) {
    console.log("Error fetching unpaid students:", error);
  }
})

// POST new student
// "/api/students"
router.post("/", async (req, res, next) => {
  const { first_name, last_name, email, phone, tuition, enrolled, instrument } = req.body;
  try {
    await db(`INSERT INTO students (first_name, last_name, email, phone, tuition, enrolled, instrument) VALUES ("${first_name}", "${last_name}", "${email}", "${phone}", ${tuition}, ${enrolled}, "${instrument}");`)
    res.send({message: "Student created"});
  } catch (error) {
    console.log(error)
  }
})

// DELETE student
// "/api/students/:id"
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await db(`DELETE FROM students WHERE id=${id}`)
    res.send({message: "Student deleted"});
  } catch (error) {
    console.log(error)
  }
})

// GET all students with their payments 
// "/api/students/payments"

// POST payment
// "/api/students/:id"
router.post('/:id', async  (req, res, next) => {
  const { id } = req.params;
  const { due_date  } = req.body;

  try {

    await db(`INSERT INTO payments (student_id, due_date, is_paid) VALUES (${id}, "${due_date}", 0);`)

    res.send({message: "Payment created"});
  } catch (error) {
    console.log(error);
  }
})

// PATCH payment for specific student using payment id (payment_date and is_paid)
// "/api/students/payments/:id"
// UPDATE payments SET payment_date = "2025-02-06", is_paid=NOT is_paid WHERE id=4;
router.put("/check/unpaid/:id", async (req,  res, next) => {
  const { id } = req.params;
  const { payment_date } = req.body;

  // Ensure payment_date is provided if is_paid is being updated
  if (typeof is_paid !== "undefined" && !payment_date) {
  return res.status(400).json({ error: "payment date is required" });
}

  try {
    await db(`UPDATE payments SET payment_date = "${payment_date}", is_paid=1 WHERE id=${id};`);
    res.send({message: "Payment updated"})
  } catch (error) {
    console.log(error)
  }
})


// DELETE payment
// "/api/students/payments/:id"
router.delete("/payments/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await db(`DELETE FROM payments WHERE id=${id}`)
    res.send({message: "Payment deleted"});
  } catch (error) {
    console.log(error)
  }
})


//PATCH student info (feature extension)

module.exports = router;
