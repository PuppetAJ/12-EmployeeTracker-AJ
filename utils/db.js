class DB {

    constructor(db) {
        this.connection = db;
    }

    findAllEmployees() {
        return this.connection.promise().query(
            `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`
        );
    }
  
}

module.exports = DB;