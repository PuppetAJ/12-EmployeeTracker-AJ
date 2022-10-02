class DB {

    constructor(db) {
        this.connection = db;
    }

    findAllEmployees() {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`
        );
    }

    addEmployee(firstName, lastName, role, manager) {
        return this.connection.promise().query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [firstName, lastName, role, manager]
        )
    }

    findAllRoles() {
        return this.connection.promise().query(
            `SELECT * FROM role`
        )
    }

    findAllManagers() {
        return this.connection.promise().query(
            `SELECT * FROM employee WHERE manager_id IS NULL`
        )
    }

    findAllDepartments() {
        return this.connection.promise().query(
            `SELECT * FROM department`
        )
    }
  
}

module.exports = DB;