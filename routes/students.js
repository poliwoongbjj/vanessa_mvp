var express = require("express");
var router = express.Router();
const db = require("../model/helper");

// all the routes start with /api/students because that is what is in the app.js

// GET all students
// "/api/students"
router.get("/", async (req, res, next) => {
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
    instrument: data[0].instrument,
    enrolled: data[0].enrolled,
    payments: [],
  };

  data.forEach((payment) => {
    response.payments.push({
      due_date: payment.due_date,
      payment_date: payment.payment_date,
      is_paid: payment.is_paid,
      payment_id: payment.payment_id,
    });
  });

  return response;
};

// GET single student and include payment info
// "/api/students/:id"
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await db(
      `SELECT students.*, 
      DATE_FORMAT(payments.due_date, '%M %d %Y') AS due_date,
      DATE_FORMAT(payments.payment_date,'%M %d %Y') AS payment_date,
      payments.is_paid, 
      payments.id AS payment_id 
      FROM students 
      LEFT JOIN payments ON students.id = payments.student_id 
      WHERE students.id = ${id};`
    );

    const student = treatStudentData(results.data);
    res.send(student);
  } catch (error) {
    console.log(error);
  }
});

// GET unpaid students
// "/api/students/check/unpaid" -- NEW ROUTE
router.get("/check/unpaid", async (req, res, next) => {
  // console.log("*** Entering unpaid ***");
  try {
    const results = await db(
      `SELECT students.id, 
      students.first_name, 
      students.last_name, 
      payments.id AS payment_id, 
      payments.due_date, 
      payments.payment_date
    FROM students
    JOIN payments ON students.id = payments.student_id
     WHERE payments.is_paid = 0
     ORDER BY students.first_name ASC;`
    );
    res.send(results.data);
  } catch (error) {
    console.log("Error fetching unpaid students:", error);
  }
});

// POST new student
// "/api/students"
router.post("/", async (req, res, next) => {
  const { first_name, last_name, email, phone, tuition, enrolled, instrument } =
    req.body;
  try {
    await db(
      `INSERT INTO students (first_name, last_name, email, phone, tuition, enrolled, instrument) VALUES ("${first_name}", "${last_name}", "${email}", "${phone}", ${tuition}, ${enrolled}, "${instrument}");`
    );
    res.send({ message: "Student created" });
  } catch (error) {
    console.log(error);
  }
});

// POST payment
// "/api/students/:id"
// Because this is for one student, you need to use the treatStudentData function
router.post("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { due_date } = req.body;

  try {
    await db(
      `INSERT INTO payments (student_id, due_date, is_paid) VALUES (${id}, "${due_date}", 0);`
    );

    const results = await db(`SELECT students.*, 
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

// PATCH unpaid payment for specific student using payment id (payment_date and is_paid)
// UPDATE payments SET payment_date = "2025-02-06", is_paid=NOT is_paid WHERE id=4;
router.put("/check/unpaid/:id", async (req, res, next) => {
  const { id } = req.params;
  const { payment_date } = req.body;

  // Ensure payment_date is provided if is_paid is being updated
  if (typeof is_paid !== "undefined" && !payment_date) {
    return res.status(400).json({ error: "payment date is required" });
  }

  try {
    await db(
      `UPDATE payments SET payment_date = "${payment_date}", is_paid=1 WHERE id=${id};`
    );

    //GET THE DATA
    const results =
      await db(`SELECT students.id, students.first_name, students.last_name, payments.id AS payment_id, payments.due_date, payments.payment_date
    FROM students
    JOIN payments ON students.id = payments.student_id
     WHERE payments.is_paid = 0
     ORDER BY students.first_name ASC;`);
    res.send(results.data);
  } catch (error) {
    console.log(error);
  }
});

// PATCH student info
// "/api/students/:id"
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, tuition, enrolled, instrument } =
    req.body;

  try {
    // Check if student exists
    const checkStudent = await db(`SELECT * FROM students WHERE id = ${id};`);

    if (checkStudent.data.length === 0) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Build UPDATE query dynamically based on provided fields
    let updateFields = [];
    if (first_name) updateFields.push(`first_name = "${first_name}"`);
    if (last_name) updateFields.push(`last_name = "${last_name}"`);
    if (email) updateFields.push(`email = "${email}"`);
    if (phone) updateFields.push(`phone = "${phone}"`);
    if (tuition) updateFields.push(`tuition = ${tuition}`);
    if (typeof enrolled !== "undefined")
      updateFields.push(`enrolled = ${enrolled}`);
    if (instrument) updateFields.push(`instrument = "${instrument}"`);

    if (updateFields.length === 0) {
      return res.status(400).send({ message: "No fields to update" });
    }

    // Update student
    await db(
      `UPDATE students SET ${updateFields.join(", ")} WHERE id = ${id};`
    );

    // Get updated student data with payments
    const results = await db(
      `SELECT students.*, 
      DATE_FORMAT(payments.due_date, '%M %d %Y') AS due_date,
      DATE_FORMAT(payments.payment_date,'%M %d %Y') AS payment_date,
      payments.is_paid, 
      payments.id AS payment_id 
      FROM students 
      LEFT JOIN payments ON students.id = payments.student_id 
      WHERE students.id = ${id};`
    );

    const student = treatStudentData(results.data);
    res.send(student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send({ message: "Error updating student" });
  }
});

// DELETE payment
// "/api/students/payments/:paymentId"
router.delete("/payments/:paymentId", async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    // First check if payment exists
    const checkPayment = await db(
      `SELECT * FROM payments WHERE id = ${paymentId};`
    );

    if (checkPayment.data.length === 0) {
      return res.status(404).send({ message: "Payment not found" });
    }

    // Get student ID before deleting payment (for returning updated student data)
    const studentId = checkPayment.data[0].student_id;

    // Delete the payment
    await db(`DELETE FROM payments WHERE id = ${paymentId};`);

    // Get updated student data
    const results = await db(
      `SELECT students.*, 
      DATE_FORMAT(payments.due_date, '%M %d %Y') AS due_date,
      DATE_FORMAT(payments.payment_date,'%M %d %Y') AS payment_date,
      payments.is_paid, 
      payments.id AS payment_id 
      FROM students 
      LEFT JOIN payments ON students.id = payments.student_id 
      WHERE students.id = ${studentId};`
    );

    const student = treatStudentData(results.data);
    res.send(student);
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).send({ message: "Error deleting payment" });
  }
});
// DELETE student
// "/api/students/:id"
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if student exists
    const checkStudent = await db(`SELECT * FROM students WHERE id = ${id};`);

    if (checkStudent.data.length === 0) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Delete student (will cascade delete related payments due to FK constraint)
    await db(`DELETE FROM students WHERE id = ${id};`);

    // Get updated list of all students
    const results = await db("SELECT * FROM students ORDER BY first_name;");
    res.send(results.data);
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send({ message: "Error deleting student" });
  }
});

module.exports = router;
