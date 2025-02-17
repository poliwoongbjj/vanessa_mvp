### Dependencies

- Run `npm install` in project directory. This will install server-related dependencies such as `express`.
- `cd client` and run `npm install`. This will install client dependencies (React).

### Database Prep

- Access the MySQL interface in your terminal by running `mysql -u root -p`
- Create a new database called facebook: `create database mvp`
- Add a `.env` file to the project folder of this repository containing the MySQL authentication information for MySQL user. For example:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_NAME=mvp
   DB_PASS=YOURPASSWORD

   ```