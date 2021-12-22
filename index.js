const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const Connection = require('mysql2/typings/mysql/lib/Connection');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost', 
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

db.connect(function(err){
    if(err) throw err;
    console.log('CONNECTED SQL SUCCESSFUL');
    trackerChoice();
})

const trackerChoice = () => {
    return inquirer.prompt(
        {
            type: 'list',
            name: 'options',
            message: 'Pick one of the following options:',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role'
            ]
        })
        .then(choose => {
            switch(choose.option) {
                case 'View all Departments':
                    //view all departments function
                    allDepartments();
                break;

                case 'View all Roles':
                    //view all roles function
                    allRoles();
                break;

                case 'View all Employees':
                    //view all employees function
                    allEmployees();
                break;

                case 'Add a Department':
                    //add a new department function
                    newDepartment();
                break;

                case 'Add a Role':
                    //add a new role function
                    newRole();
                break;

                case 'Add an Employee':
                    //add a new employee function
                    newEmployee();
                break;

                case 'Update an Employee Role':
                    //update an employee's role function
                    updateRole();
                break;
            };
        });
};

//view all departments
const allDepartments = () => {
    const sql = `SELECT * FROM department`;
    console.table(sql);
};


