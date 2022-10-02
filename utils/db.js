// creates database class
class DB {

    // constructor for database, takes connection for use in queries later
    constructor(db) {
        this.connection = db;
    };

    // finds all employees and joins data from multiple tables so that ids are swapped for their appropriate names, and names are concatonated into one string
    findAllEmployees() {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`
        );
    };

    // finds all employees working under a manager and joins data from multiple tables so that ids are swapped for their appropriate names
    findAllEmployeesByManager(managerID) {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id = ?`, [managerID]
        );
    };

    // finds all employees within a department and joins data from multiple tables so thart ids are swapped for their appropriate names, and names are concatonated into one string
    findAllEmployeesByDepartment (departmentID) {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN employee m ON e.manager_id = m.id WHERE department_id = ?`, [departmentID]
        );
    };

    // adds an employee into the employee table, using a prepared statement to take paramaters
    addEmployee(firstName, lastName, role, manager) {
        return this.connection.promise().query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [firstName, lastName, role, manager]
        );
    };

    // updates an employee's role in the employee table, using a prepared statement to take paramaters
    updateEmployee(employeeID, roleID) {
        return this.connection.promise().query(
            `UPDATE employee SET role_id = ? WHERE id = ?`, [roleID, employeeID]
        );
    };
    
    // finds all entries in the employee table which do not have managers (therefore being a manager)
    findAllManagers() {
        return this.connection.promise().query(
            `SELECT * FROM employee WHERE manager_id IS NULL`
        );
    };

    // updates the manager of an employee in the employee table, using a prepared statement to take paramaters
    updateManager(employeeID, managerID) {
        return this.connection.promise().query(
            `UPDATE employee SET manager_id = ? WHERE id = ?`, [managerID, employeeID]
        );
    };

    // deletes an employee from the employee table using its id in a prepared statement
    deleteEmployee(employeeID) {
        return this.connection.promise().query(
            `DELETE FROM employee WHERE id = ?`, [employeeID]
        );
    };

    // returns data containing all rows with no formatting
    findAllRolesRaw() {
        return this.connection.promise().query(
            `SELECT * FROM role`
        );
    };

    // finds all roles and formats them through table joins so that department ids display as their proper names
    findAllRoles() {
        return this.connection.promise().query(
            `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`
        );
    };

    // adds role into role table using a prepared statement to take paramaters
    addRole(title, salary, department) {
        return this.connection.promise().query(
            `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [title, salary, department]
        );
    };

    // deletes a role from the role table using its id as a prepared statement
    deleteRole(roleID) {
        return this.connection.promise().query(
            `DELETE FROM role WHERE id = ?`, [roleID]
        );
    };

    // adds a department to the department table accepting a name as a paramater in a prepared statement
    addDepartment(name) {
        return this.connection.promise().query(
            `INSERT INTO department (name) VALUES (?)`, [name]
        );
    };

    // deletes a department from the department table using its id as a prepared statement
    deleteDepartment(departmentID) {
        return this.connection.promise().query(
            `DELETE FROM department WHERE id = ?`, [departmentID]
        )
    };

    // returns data of all departments within the department table
    findAllDepartments() {
        return this.connection.promise().query(
            `SELECT * FROM department`
        );
    };

    // finds the total utilized budget of a department. creates a temporary column which counts the number of employees in the department, and adds up their salaries in the other column
    // accepts a department id as a paramater for the prepared statement
    findTotalUtilizedBudget(departmentID) {
        return this.connection.promise().query(
            `SELECT COUNT(role.salary) as employees, SUM(role.salary) AS 'total utilized budget' FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = ?`, [departmentID]
        );
    };
  
};

// exports DB class
module.exports = DB;