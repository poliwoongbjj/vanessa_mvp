# Version 1

To streamline payment management for my dad's guitar school, I developed Payment Tracker, a full-stack application. The frontend is built with React, React Router, and Bootstrap, while the backend utilizes Express, MySQL, Nodemon, and dotenv.

## Dependencies

- Run `npm install` in project directory. This will install server-related dependencies such as `express`.
- `cd client` and run `npm install`. This will install client dependencies (React).

## Database Prep

- Access the MySQL interface in your terminal by running `mysql -u root -p`
- Create a new database called mvp: `create database mvp`
- Add a `.env` file to the project folder of this repository containing the MySQL authentication information for MySQL user. For example:

 ```
   DB_HOST=localhost
   DB_USER=root
   DB_NAME=mvp
   DB_PASS=YOURPASSWORD
```

- Run `npm run migrate` in a new terminal window in the project folder. This command will create two tables called 'students' and 'payments' in the database.

- In your MySQL console, you can run `use mvp;` and then `describe students;` to see the structure of the students table. Same thing for the 'payments' table. This is a description of the tables:

![image of mysql tables](<public/MVP Payment Tracker Database Schema.png>)
IMPORTANT: The foreign key for tables is student_id and the only column that accepts NULL values is payment_date.

## Development

- Run `npm start` in project directory to start the Express server on port 4000
- In another terminal, do `cd client` and run `npm run dev` to start the client in development mode with hot reloading in port 5173.

## Front-end components and App features

- <ins>AddStudent.jsx (Home Page)</ins>: Add Student Form to add a student to the database
- <ins>Navbar.jsx</ins>: Navigation bar that allows user to toggle between Student Dashboard andthe Add Student Form
- <ins>Students.jsx</ins>: "Student Dashboard"page that shows the list of all students and the list of students with missing payments and for which months. User also can mark a month as paid in the unpaid payments list. 
- <ins>Student.jsx</ins>: Shows student payment history and also has option to add payment for next month. The due date will automatically be set to the first of the following month.  
- <ins>Page404</ins>: Displays a Page404 when user inputs an unestablished route 

_This is a student project that was created at [CodeOp](http://codeop.tech), a full stack development bootcamp in Barcelona._

