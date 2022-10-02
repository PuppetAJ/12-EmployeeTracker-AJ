const inquirer = require ('inquirer');
const connection = require('./db/connection');
const DB = require ('./utils/db');
const ascii = require ('./utils/ascii');
const cTable = require('console.table');

const db = new DB(connection);

let employeeArr = [];
let rolesArr = [];
let departmentsArr = [];
let managerArr = [{value: null, name: 'No manager'}];

const promptUser = () => {
    updateArrays();
    return inquirer.prompt([
        {
            type: 'list',
            name: 'nav',
            message: 'What would you like to do?',
            choices: [
                {value: 0, name: 'View all employees'},
                {value: 1, name: 'View all employees by manager'},
                {value: 2, name: 'View all employees by department'},
                {value: 3, name: 'Add Employee' },
                {value: 4, name: 'Delete employee'},
                {value: 5, name: 'Update Employee Role'},
                {value: 6, name: `Update Employee Manager`},
                {value: 7, name: 'View All Roles'},
                {value: 8, name: 'Add Role'},
                {value: 9, name: 'Delete Role'},
                {value: 10, name: 'View All Departments'},
                {value: 11, name: 'Add Department'},
                {value: 12, name: 'Delete Department'},
                {value: 13, name: 'View Total Utilized Budget of a department'},
                {value: 14, name: 'Quit'}
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

const viewByManager = () => {

    const newManagerArr = managerArr.slice();
    newManagerArr.shift();

    return inquirer.prompt([
        {
            type: 'list',
            name: 'managerID',
            message: 'Which manager would you like to see the employees of?',
            choices: newManagerArr   
        }
    ])
    .then((data) => {
        db.findAllEmployeesByManager(data.managerID)
            .then(([rows, fields]) => {
                console.log(`
                `);
                console.table(rows);
                console.log(`
                `);
                promptUser();
            })
    })
}

const viewByDepartment = () => {
    
    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department woudl you like to see the employees of?',
            choices: departmentsArr
        }
    ])
    .then((data) => {
        db.findAllEmployeesByDepartment(data.departmentID)
            .then(([rows, fields]) => {
                console.log(`
                `);
                console.table(rows);
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

const updateManager = () => {

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Which employee\'s manager would you like to update?',
            choices: employeeArr
        },
        {
            type: 'list',
            name: 'managerID',
            message: 'Please select a manager',
            choices: managerArr
        }
    ])
    .then((data) => {
        db.updateManager(data.employeeID, data.managerID)
            .then(() => {
                console.log(`
                `);
                console.log('Employee\'s manager updated in database');
                console.log(`
                `);
                promptUser();
            });
    });
};

const deleteEmployee = () => {

    const newEmployeeArr = employeeArr.slice();
    newEmployeeArr.unshift({value: null, name: 'None'});

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Which employee would you like to remove?',
            choices: newEmployeeArr
        }
    ])
    .then((data) => {
        db.deleteEmployee(data.employeeID)
            .then(() => {
                if (data.employeeID != null) {
                    console.log('Employee removed from database');
                }
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

const deleteRole = () => {

    const newRolesArr = rolesArr.slice();
    newRolesArr.unshift({value: null, name: 'None'});

    return inquirer.prompt([
        {
            type: 'list',
            name: 'roleID',
            message: 'Which role would you like to remove?',
            choices: newRolesArr
        }
    ])
    .then((data) => {
        db.deleteRole(data.roleID)
            .then(() => {
                if (data.roleID != null) {
                    console.log('Role removed from database');
                }
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

const deleteDepartment = () => {

    const newDepartmentsArr = departmentsArr.slice();
    newDepartmentsArr.unshift({value: null, name: 'None'});

    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department would you like to remove?',
            choices: newDepartmentsArr
        }
    ])
    .then((data) => {
        db.deleteDepartment(data.departmentID)
            .then(() => {
                if (data.departmentID != null) {
                    console.log('Department removed from database');
                }
                promptUser();
            })
    })
}

const viewTotalUtilizedBudget = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department would you like to view the budget of?',
            choices: departmentsArr
        }
    ])
    .then((data) => {
        db.findTotalUtilizedBudget(data.departmentID)
            .then(([rows, fields]) => {
                console.log(`
                `);
                console.table(rows);
                console.log(`
                `);
                promptUser();
            });
    });
}

const updateArrays = () => {

    employeeArr = [];
    rolesArr = [];
    departmentsArr = [];
    managerArr = [{value: null, name: 'No manager'}];

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
            viewByManager();
            break;
        case 2:
            viewByDepartment();
            break;
        case 3:
            addEmployee();
            break;
        case 4:
            deleteEmployee();
            break;
        case 5:
            updateRole();
            break;
        case 6:
            updateManager();
            break;
        case 7:
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
        case 8:
            addRole();
            break;
        case 9:
            deleteRole();
            break;
        case 10:
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
        case 11:
            addDepartment();
            break;
        case 12:
            deleteDepartment();
            break;
        case 13:
            viewTotalUtilizedBudget();
            break;
        case 14:
            console.log(`
            `);
            console.log('Goodbye!');
            process.exit(1);                
    }
}

ascii();
promptUser();

