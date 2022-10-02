const inquirer = require ('inquirer');
const connection = require('./db/connection');
const DB = require ('./utils/db');
const ascii = require ('./utils/ascii');
const cTable = require('console.table');

const db = new DB(connection);

const employeeArr = [];
const rolesArr = [];
const managerArr = [{value: null, name: 'None'}];
const departmentsArr = [];

const promptUser = () => {
    updateArrays();
    return inquirer.prompt([
        {
            type: 'list',
            name: 'nav',
            message: 'What would you like to do?',
            choices: [
                {value: 0, name: 'View all employees'},
                {value: 1, name: 'Add Employee' },
                {value: 2, name: 'Update Employee Role'},
                {value: 3, name: 'View All Roles'},
                {value: 4, name: 'Add Role'},
                {value: 5, name: 'View All Departments'},
                {value: 6, name: 'Add Department'},
                {value: 7, name: 'Quit'}
            ]
        },
    ]).then((data) => {
        checkNav(data.nav);
    })
};

const addEmployee = () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'What is the first name of this employee?',
            validate: (input) => {
                if (input.indexOf(';') > -1 || input.indexOf(" ") > -1) {
                    return "Input must not containing spaces or semicolons!";
                }

                if (input === null || input === "") {
                    return "Please enter a name!"
                }

                if (input.length > 30) {
                    return "Name is too long!";
                }

                return true;
            }
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'What is the last name of this employee?',
            validate: (input) => {
                if (input.indexOf(';') > -1 || input.indexOf(" ") > -1) {
                    return "Input must not contain spaces or semicolons!";
                }

                if (input === null || input === "") {
                    return "Please enter a name!"
                }

                if (input.length > 30) {
                    return "Name is too long!";
                }

                return true;
            }
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is this employee\'s Role?',
            choices: rolesArr
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is this employee\'s manager?',
            choices: managerArr
        }
    ]).then((data) => {
        const { employeeFirstName, employeeLastName, employeeRole, employeeManager } = data;
        db.addEmployee( employeeFirstName, employeeLastName, employeeRole, employeeManager)
            .then(() => {
                console.log(`
                `);
                console.log('Employee added to database');
                console.log(`
                `);
                promptUser();
            })
    })
}

const updateRole = () => {

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Which employee would you like to update?',
            choices: employeeArr
        },
        {
            type: 'list',
            name: 'roleID',
            message: 'What would you like this employee\'s new role to be?',
            choices: rolesArr
        }
    ])
    .then((data) => {
        console.log(data);
        db.updateEmployee(data.employeeID, data.roleID)
            .then(() => {
                console.log(`
                `);
                console.log("Role updated in database");
                console.log(`
                `);
                promptUser();
            })

    })
}

const addRole = () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of this role?',
            validate: (input) => {
                if (input.indexOf(';') > -1) {
                    return "Input must not contain semicolons!";
                }

                if (input === null || input === "") {
                    return "Please enter a name!"
                }

                if (input.length > 30) {
                    return "Name is too long!";
                }

                return true;
                }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
            validate: (input) => {
                if (isNaN(input)) {
                    return "Please enter a number!"
                } else {
                    return true;
                }
            }
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'What department does this role belong to?',
            choices: departmentsArr
        }
    ]).then((data) => {
       const { roleName, roleSalary, roleDepartment } = data;
       db.addRole(roleName, roleSalary, roleDepartment)
            .then(() => {
                console.log(`
                `);
                console.log('Role added to database');
                console.log(`
                `);
                promptUser();
            })
    })
}

const addDepartment = () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of this department?',
            validate: (input) => {
                if (input.indexOf(';') > -1) {
                    return "Input must not contain semicolons!";
                }

                if (input === null || input === "") {
                    return "Please enter a name!"
                }

                if (input.length > 30) {
                    return "Name is too long!";
                }

                return true;
                }
        }
    ]).then((data) => {
        db.addDepartment(data.departmentName)
            .then(() => {
                console.log(`
                `);
                console.log("Department added to database");
                console.log(`
                `);
                promptUser();
            });
    });
}

const updateArrays = () => {

    db.findAllEmployees()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, first_name, last_name } = el;
            const employee = { value: id, name: `${first_name} ${last_name}`};
            employeeArr.push(employee);
        })
    })

    db.findAllRolesRaw()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, title } = el;
            const role = { value: id, name: title };
            rolesArr.push(role);
        })
    })

    db.findAllManagers()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, first_name, last_name } = el;
            const manager = { value: id, name: `${first_name} ${last_name}`};
            managerArr.push(manager);
        })
    })

    db.findAllDepartments()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, name } = el;
            const department = { value: id, name: name };
            departmentsArr.push(department);
        })
    })

}

const checkNav = (nav) => {
    switch(nav) {
        case 0:
            db.findAllEmployees()
                .then(([rows, fields]) => {
                    console.log(`
                    `);
                    console.table(rows);
                    console.log(`
                    `);
                    promptUser();
                })
                .catch((err) => {
                    console.log(err);
                })
            break;
        case 1:
            addEmployee();
            break;
        case 2:
            updateRole();
            break;
        case 3:
            db.findAllRoles()
                .then(([rows, fields]) => {
                    console.log(`
                    `);
                    console.table(rows);
                    console.log(`
                    `);
                    promptUser();
                })
                .catch((err) => {
                    console.log(err);
                })
            break;
        case 4:
            addRole();
            break;
        case 5:
            db.findAllDepartments()
                .then(([rows, fields]) => {
                    console.log(`
                    `);
                    console.table(rows);
                    console.log(`
                    `);
                    promptUser();
                })
            break;
        case 6:
            addDepartment();
            break;
        case 7:
            console.log(`
            `);
            console.log('Goodbye!');
            console.log(`
            `);
            process.exit(1);                
    }
}

promptUser();

