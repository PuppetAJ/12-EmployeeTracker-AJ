// imports modules and functions from other files
const inquirer = require ('inquirer');
const connection = require('./db/connection');
const DB = require ('./utils/db');
const ascii = require ('./utils/ascii');
const cTable = require('console.table');

// creates a new db instance passing the connection into its constructor, allowing us to use connection in our methods
const db = new DB(connection);

// array declarations
let employeeArr = [];
let rolesArr = [];
let departmentsArr = [];
let managerArr = [{value: null, name: 'No manager'}];

// function containing initial prompt logic
const promptUser = () => {
    // calls updateArrays function to make sure arrays update while user selects what to do
    updateArrays();
    // returns inquirer prompt
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
        // sends the selected value to checkNav function
        checkNav(data.nav);
    });
};

// function containing logic to add employees to database
const addEmployee = () => {

    // inquirer prompts for user input, with validation to prevent semicolons and occasionally spaces from being included
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
        // destructures data object
        const { employeeFirstName, employeeLastName, employeeRole, employeeManager } = data;
        // executed addEmployee method using the destructured data
        db.addEmployee( employeeFirstName, employeeLastName, employeeRole, employeeManager)
            .then(() => {
                // logs messages when complete, and prompts user again
                console.log(`
                `);
                console.log('Employee added to database');
                console.log(`
                `);
                promptUser();
            });
    });
};

// function containing logic to view employees by manager
const viewByManager = () => {

    // creates new array from the manager array
    const newManagerArr = managerArr.slice();
    // removes first entry (no manager) since we can't add no manager
    newManagerArr.shift();

    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'managerID',
            message: 'Which manager would you like to see the employees of?',
            choices: newManagerArr   
        }
    ])
    .then((data) => {
        // calls method from db class
        db.findAllEmployeesByManager(data.managerID)
            .then(([rows, fields]) => {
                // logs data as table once complete
                console.log(`
                `);
                console.table(rows);
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic to view employees by department
const viewByDepartment = () => {
    
    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department woudl you like to see the employees of?',
            choices: departmentsArr
        }
    ])
    .then((data) => {
        // calls method from db class
        db.findAllEmployeesByDepartment(data.departmentID)
            .then(([rows, fields]) => {
                // logs data into table
                console.log(`
                `);
                console.table(rows);
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic to update an employee's role
const updateRole = () => {

    // inquirer prompts
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
        // calls method from db constructor
        db.updateEmployee(data.employeeID, data.roleID)
            .then(() => {
                // logs message once method is done
                console.log(`
                `);
                console.log("Role updated in database");
                console.log(`
                `);
                // prompts user again
                promptUser();
            });

    });
};

// function containing logic to update an employee's manager
const updateManager = () => {

    // inquirer prompts
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
        // calls method from db class
        db.updateManager(data.employeeID, data.managerID)
            .then(() => {
                // logs message once method is complete
                console.log(`
                `);
                console.log('Employee\'s manager updated in database');
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for deleting an employee from the database
const deleteEmployee = () => {

    // creates new array from employeeArr
    const newEmployeeArr = employeeArr.slice();
    // adds a "none" option to the array for user input
    newEmployeeArr.unshift({value: null, name: 'None'});

    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Which employee would you like to remove?',
            choices: newEmployeeArr
        }
    ])
    .then((data) => {
        // executes delete method from db class
        db.deleteEmployee(data.employeeID)
            .then(() => {
                // checks if the value is anything other than null
                if (data.employeeID != null) {
                    // if so, logs message
                    console.log('Employee removed from database');
                }
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for adding a role to the database
const addRole = () => {

    // inquirer prompts
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
        // destructures data object
        const { roleName, roleSalary, roleDepartment } = data;
        // uses destructured data to execute addRole method from db class
        db.addRole(roleName, roleSalary, roleDepartment)
            .then(() => {
                // logs messages once method is complete
                console.log(`
                `);
                console.log('Role added to database');
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for deleting a role from the database
const deleteRole = () => {

    // creates a new array from rolesArr
    const newRolesArr = rolesArr.slice();
    // adds none option for user input
    newRolesArr.unshift({value: null, name: 'None'});

    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'roleID',
            message: 'Which role would you like to remove?',
            choices: newRolesArr
        }
    ])
    .then((data) => {
        // executes deleteRole method from db class
        db.deleteRole(data.roleID)
            .then(() => {
                // checks if id value is anything other than null
                if (data.roleID != null) {
                    // executes message if above is true
                    console.log('Role removed from database');
                }
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for adding a department to the database
const addDepartment = () => {

    // inquirer prompts
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
        // executes addDepartment method from db class
        db.addDepartment(data.departmentName)
            .then(() => {
                // logs message once method is complete
                console.log(`
                `);
                console.log("Department added to database");
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for removing a department from the database
const deleteDepartment = () => {

    // creates new array from departmentsArr
    const newDepartmentsArr = departmentsArr.slice();
    // adds None value for user input to the array
    newDepartmentsArr.unshift({value: null, name: 'None'});

    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department would you like to remove?',
            choices: newDepartmentsArr
        }
    ])
    .then((data) => {
        // executes delete function using department's id
        db.deleteDepartment(data.departmentID)
            .then(() => {
                // checks if the value is anything other than null
                if (data.departmentID != null) {
                    // if above is true then message is displayed
                    console.log('Department removed from database');
                }
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for viewing the total utilized budget of a department
const viewTotalUtilizedBudget = () => {
    // inquirer prompts
    return inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Which department would you like to view the budget of?',
            choices: departmentsArr
        }
    ])
    .then((data) => {
        // executes method from db class
        db.findTotalUtilizedBudget(data.departmentID)
            .then(([rows, fields]) => {
                // logs data in a console.table
                console.log(`
                `);
                console.table(rows);
                console.log(`
                `);
                // prompts user again
                promptUser();
            });
    });
};

// function containing logic for updating arrays containing database data we require for prompts
const updateArrays = () => {

    // resets arrays each time the function is called
    employeeArr = [];
    rolesArr = [];
    departmentsArr = [];
    managerArr = [{value: null, name: 'No manager'}];

    // executes methods which grab data from our database and pushes them into our arrays formatted for use in our inquirer prompts

    db.findAllEmployees()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, first_name, last_name } = el;
            const employee = { value: id, name: `${first_name} ${last_name}`};
            employeeArr.push(employee);
        });
    });

    db.findAllRolesRaw()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, title } = el;
            const role = { value: id, name: title };
            rolesArr.push(role);
        });
    });

    db.findAllManagers()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, first_name, last_name } = el;
            const manager = { value: id, name: `${first_name} ${last_name}`};
            managerArr.push(manager);
        });
    });

    db.findAllDepartments()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, name } = el;
            const department = { value: id, name: name };
            departmentsArr.push(department);
        });
    });

};

// function containing logic for checking which option the user selected from the promptUser function
const checkNav = (nav) => {
    // switch statement which checks the nave value and executes the appropriate function 
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
                });
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
                });
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
                .catch((err) => {
                    console.log(err);
                });
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
            // exits process
            process.exit(1);                
    };
};

// calls ascii function from utils/ascii.js
ascii();
// calls initial prompts to the user
promptUser();

