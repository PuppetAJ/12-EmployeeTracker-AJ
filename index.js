const inquirer = require ('inquirer');
const connection = require('./db/connection');
const DB = require ('./utils/db');
const ascii = require ('./utils/ascii');
const cTable = require('console.table');

const db = new DB(connection);

const promptUser = () => {
    ascii();
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
    ]);
};

const addEmployee = () => {

    const roleArr = [];
    const managerArr = [{value: null, name: 'None'}];

    db.findAllRoles()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, title } = el;
            const role = { value: id, name: title }
            roleArr.push(role);
        })
    })

    db.findAllManagers()
    .then(([rows, fields]) => {
        rows.forEach((el) => {
            const { id, first_name, last_name } = el;
            const manager = { value: id, name: `${first_name} ${last_name}`}
            managerArr.push(manager);
        })
    })

    return inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'What is the first name of this employee?',
            validate: (input) => {
                if (input.indexOf(';') > -1 || input.indexOf(" ") > -1) {
                    return "Input must not containing spaces or semicolons!";
                }

                if ( input === null || input === "") {
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
                    return "Input must not containing spaces or semicolons!";
                }

                if ( input === null || input === "") {
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
            choices: roleArr
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is this employee\'s manager?',
            choices: managerArr
        }
    ]).then((promptData) => {
        const { employeeFirstName, employeeLastName, employeeRole, employeeManager } = promptData;
        db.addEmployee( employeeFirstName, employeeLastName, employeeRole, employeeManager)
            .then(() => {
                console.log('Employee added to database');
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
                })
                .catch((err) => {
                    console.log(err);
                })
            break;
        case 1:
            addEmployee();
            break;
        case 5:
            db.findAllDepartments()
                .then(([rows, fields]) => {
                    console.log(`
                    `);
                    console.table(rows);
                    console.log(`
                    `);
                })
            break;
        default:
            console.log('F');
            break;                  
    }
}

addEmployee();