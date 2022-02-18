const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("Connected to the company_db database....")
);

db.connect((err) => {
  if (err) {
    throw error;
  }
});
//inqurirer
promptUser();
function promptUser() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "displayChoices",
        message: "Please choose an option",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "delete an employee",
          "delete a department",
          "delete a role",
          "view a deparment budget",
        ],
      },
    ])
    .then((selectedOption) => {
      switch (selectedOption.displayChoices) {
        case "view all departments":
          viewDepartments();
          break;
        case "view all roles":
          viewRoles();
          break;
        case "view all employees":
          viewEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateEmployeeRole();
          break;
        case "delete an employee":
          deleteEmployee();
          break;
        case "delete a department":
          deleteDepartment();
          break;
        case "delete a role":
          deleteRole();
          break;
        case "view a deparment budget":
          viewBudget();
        default:
          console.log("you are exiting");
          break;
      }
    });
}

// VIEW
function viewDepartments() {
    db.query('SELECT * FROM company_db.department;', function (err, results) {
        console.table(results)
        promptUser()
    })
}
function viewRoles() {
    db.query('select role.title, role.id, role.salary, department.name from department RIGHT JOIN role on department.id = role.department_id;'
        , function (err, results) {
            console.table(results)
            promptUser()
        })
    }
    function viewEmployees() {
        // finish manager part of query
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT (manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employee
        Join employee manager_name on employee.manager_id = manager_name.id
        JOIN role ON employee.role_id = role.id
         JOIN department ON role.department_id = department.id;
       `
            , function (err, results) {
                console.table(results)
                promptUser()
            })
    }
    function viewBudget(){
        db.query('SELECT * FROM company_db.department;', function (err, results) {
          // console.table(results); //logs role table, id is referencing roles
          let departmentList = [];
        results.forEach(result => departmentList.push({name: result.name, value: result.id}));