class DB {

    constructor(db) {
        this.connection = db;
    }

    findAllEmployees() {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`
        );
    }

    findAllEmployeesByManager(managerID) {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id = ?`, [managerID]
        );
    }

    findAllEmployeesByDepartment (departmentID) {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN employee m ON e.manager_id = m.id WHERE department_id = ?`, [departmentID]
        );
    }

    addEmployee(firstName, lastName, role, manager) {
        return this.connection.promise().query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [firstName, lastName, role, manager]
        );
    }

    updateEmployee(employeeID, roleID) {
        return this.connection.promise().query(
            `UPDATE employee SET role_id = ? WHERE id = ?`, [roleID, employeeID]
        );
    }
    
    findAllManagers() {
        return this.connection.promise().query(
            `SELECT * FROM employee WHERE manager_id IS NULL`
        );
    }

    updateManager(employeeID, managerID) {
        return this.connection.promise().query(
            `UPDATE employee SET manager_id = ? WHERE id = ?`, [managerID, employeeID]
        );
    }

    deleteEmployee(employeeID) {
        return this.connection.promise().query(
            `DELETE FROM employee WHERE id = ?`, [employeeID]
        );
    }

    findAllRolesRaw() {
        return this.connection.promise().query(
            `SELECT * FROM role`
        );
    }

    findAllRoles() {
        return this.connection.promise().query(
            `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`
        );
    }

    addRole(title, salary, department) {
        return this.connection.promise().query(
            `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [title, salary, department]
        );
    }

    deleteRole(roleID) {
        return this.connection.promise().query(
            `DELETE FROM role WHERE id = ?`, [roleID]
        );
    }

    addDepartment(name) {
        return this.connection.promise().query(
            `INSERT INTO department (name) VALUES (?)`, [name]
        );
    }

    deleteDepartment(departmentID) {
        return this.connection.promise().query(
            `DELETE FROM department WHERE id = ?`, [departmentID]
        )
    }

    findAllDepartments() {
        return this.connection.promise().query(
            `SELECT * FROM department`
        );
    }

    findTotalUtilizedBudget(departmentID) {
        return this.connection.promise().query(
            `SELECT COUNT(role.salary) as employees, SUM(role.salary) AS 'total utilized budget' FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = ?`, [departmentID]
        );
    }
  
}

module.exports = DB;