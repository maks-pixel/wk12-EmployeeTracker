const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost', 
    port: 3306,
    user: 'root',
    password: 'Magdalena13!',
    database: 'employee_tracker'
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
            switch(choose.options) {
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
    db.query(`SELECT * FROM department`, (err, rows) => {
        if(err){
            console.log(err);
        }
        console.table(rows);
    });
    trackerChoice();
};

//view all roles with coresponding department names
const allRoles = () => {
    db.query(`SELECT role.*, department.name
                AS department_name
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`, (err, rows) => {
        if(err){
            console.log(err);
        }
        console.table(rows);
    });
    trackerChoice();
};

const allEmployees = () => {
    db.query(`SELECT e.id,
    e.first_name,
    e.last_name,
    role.title,
    role.salary,
    department.name department,
    concat(m.first_name, ' ', m.last_name) manager
    FROM employee e
    LEFT JOIN role ON e.role_id =  role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON m.id = e.manager_id;`, (err, rows) => {
        if(err){
            console.log(err);
        }
        console.table(rows);
    });
    trackerChoice();
};