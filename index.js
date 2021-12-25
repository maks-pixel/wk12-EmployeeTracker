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
    // trackerChoice();
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
                'Update an Employee Role',
                'All done'
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

                case 'All done':
                    console.log("Thanks Goodbye");
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

const newDepartment = () => {
    console.log(`
    ===================
     Add an Department
    ===================
    `);
    return inquirer.prompt({
        type: 'text',
        name: 'department',
        message: "What is the name of the new department you want to add?"
    }).then(answer => {
        console.log(answer);
        const department = answer.department;
        const sql = `INSERT INTO department (name) VALUES (?);`
        db.query(sql, department, (err, result) => {
            if (err){
                console.log(err);
            }
            console.log(`new department added: ${department}`);
        });
        trackerChoice();
    });
    

};

const newRole = () => {
    console.log(`
    ============
     Add a Role
    ============
    `);
    return inquirer.prompt([{
        type: 'text',
        name: 'role',
        message: "What is the name of the new role you want to add?"
    },
    {
        type: 'text',
        name: 'salary',
        message: "What is the salary of this new role?"
    },
    {
        type: 'number',
        name: 'department_id',
        message: "What is the id number of the department in which this role is in?"
    }
]).then(answer => {
        console.log(answer);
        const roles = [answer.role, answer.salary, answer.department_id];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`
        db.query(sql, roles, (err, result) => {
            if (err){
                console.log(err);
            }
            console.log(`new role added: ${roles[0]}`);
        });
        trackerChoice();
    });
};

const newEmployee = () => {
    console.log(`
    ================
     Add a Employee
    ================
    `);
    return inquirer.prompt([{
        type: 'text',
        name: 'first_name',
        message: "What is the new employee's first name?"
    },
    {
        type: 'text',
        name: 'last_name',
        message: "What is the new employee's last name?"
    },
    {
        type: 'number',
        name: 'role_id',
        message: "What is the id of the role in which this employee is in?"
    },
    {
        type: 'number',
        name: 'manager_id',
        message: "What is the id of the manager managing this employee?"
    }
]).then(answer => {
        console.log(answer);
        const employees = [answer.first_name, answer.last_name, answer.role_id, answer.manager_id];
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`
        db.query(sql, employees, (err, result) => {
            if (err){
                console.log(err);
            }
            console.log(`new employee added: ${employees[0]}`);
        });
        trackerChoice();
    });
};

const updateRole = () => {
    console.log(`
    =============
     update role
    =============
    `);
    const names = `SELECT first_name FROM employee;`
    db.query(names, (err, result) => {
        if (err){
            console.log(err);
        }
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employees',
                message: "Select the employee who's role you want to update",
                choices: function(){
                    let allNames = [];
                    for(i=0; i< result.length; i++){
                        allNames.push(result[i].first_name);
                    }
                    return allNames;
                }
            },
            {
                type:'number',
                name: 'role',
                message: "Enter the Role's ID?"
            }
        ]).then(function(answer){
                    console.log(answer);
                    const name = [answer.role, answer.employees];
                    const sql = `UPDATE employee
                             SET role_id =?
                             WHERE first_name=?`
                db.query(sql, name)
        });
    });
};

trackerChoice();
    
  
