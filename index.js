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
        }
    ]);
};

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
            console.log('bop');
            break;
        default:
            console.log('F');
            break;                  
    }
}

promptUser()
    .then(( { nav } ) => {
        checkNav(nav);
    })

// db.findAllEmployees()
//     .then(([rows, fields]) => {
//         console.table(rows);
//     })
//     .catch((err) => {
//         console.log(err);
//     })