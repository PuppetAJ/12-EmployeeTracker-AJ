const inquirer = require ('inquirer');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'initialNav',
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