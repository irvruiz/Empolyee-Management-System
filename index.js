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

// View
function viewDepartments() {
  db.query("SELECT * FROM company_db.department;", function (err, results) {
    console.table(results);
    promptUser();
  });
}
function viewRoles() {
  db.query(
    "select role.title, role.id, role.salary, department.name from department RIGHT JOIN role on department.id = role.department_id;",
    function (err, results) {
      console.table(results);
      promptUser();
    }
  );
}
function viewEmployees() {
  // finish manager
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT (manager_name.first_name, " ", manager_name.last_name) AS manager_name FROM employee
    Join employee manager_name on employee.manager_id = manager_name.id
    JOIN role ON employee.role_id = role.id
     JOIN department ON role.department_id = department.id;
   `,
    function (err, results) {
      console.table(results);
      promptUser();
    }
  );
}
function viewBudget() {
  db.query("SELECT * FROM company_db.department;", async function (err, results) {
    let departmentList = [];
    results.forEach((result) =>
      departmentList.push({ name: result.name, value: result.id })
    );

    const data = await inquirer
          .prompt([
              {
                  type: "list",
                  name: "departList",
                  message: "Select a department's budget to view",
                  choices: departmentList,
              },
          ]);
      let departmentIDList = data.departList;
      db.query(
          "SELECT SUM(role.salary) AS department_budget from employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?",
          [departmentIDList],
          function (err_1, results_1) {
              console.table(results_1);
              promptUser();
          }
      );
  });
}

function addDepartment() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Please enter a department name",
      },
    ])
    .then((results) => {
      db.query(
        ` INSERT INTO department set name = ("${results.departmentName}") ;`,
        function (err, results) {
          viewDepartments();
          promptUser();
        }
      );
    });
}
function displayEmployeeTable() {
  db.query("SELECT * FROM company_db.employee;", function (err, results) {
    console.table(results);
    promptUser();
  });
}

function addRole() {
  db.query(`SELECT * FROM department;`, async function (err, results) {
    let departArr = [];
    results.forEach((result) =>
      departArr.push({ name: result.name, value: result.id })
    );
    const results_1 = await inquirer
          .prompt([
              {
                  type: "input",
                  name: "roleName",
                  message: "Please enter a role name",
              },
              {
                  type: "input",
                  name: "roleSalary",
                  message: "Please enter a role Salary",
              },
              {
                  type: "list",
                  name: "roleDepartment",
                  choices: departArr,
                  message: "Please enter a department",
              },
          ]);
      db.query(
          `INSERT INTO department set company_db.role.title = ${results_1.roleName}, company_db.role.salary = ${results_1.roleSalary}, company_db.role.department_id = ${results_1.roleDepartment};`,
          function (err_1, results_2) {
              viewRoles();
              promptUser();
          }
      );
      if (err)
          throw new Error("query failure : ", err);
  });
}
function addEmployee() {
  db.query(`Select * From company_db.employee ;`, async function (err, results) {
    const results_1 = await inquirer
          .prompt([
              {
                  type: "input",
                  name: "employeeFName",
                  message: "Please enter the employees first name",
              },
              {
                  type: "input",
                  name: "employeeLName",
                  message: "Please enter the employees last name",
              },
              {
                  type: "input",
                  name: "employeeRole",
                  message: "Please enter a role for the employee",
              },
          ]);
      var empLN = results_1.employeeLName;
      var empFN = results_1.employeeFName;
      var empRoleID = results_1.employeeRole;
      console.log("Irvin");
      console.table(results_1);
      db.query(
          `select * from company_db.employee where manager_id is null;`,
          function (err_1, results_2) {
              var employeeArr = [];
              results_2.forEach((result) => employeeArr.push({
                  name: result.first_name + " " + result.last_name,
                  value: result.id,
              })
              );
              return inquirer
                  .prompt([
                      {
                          type: "list",
                          name: "employeeManager",
                          message: "Who is the employee's manager?",
                          choices: employeeArr,
                      },
                  ])
                  .then((data) => {
                      db.query(
                          `INSERT  INTO company_db.employee (company_db.employee.first_name, company_db.employee.last_name, company_db.employee.role_id, company_db.employee.manager_id) Values("${empFN}", "${empLN}",${empRoleID}, ${data.employeeManager})`,
                          function (err_2, results_3) {
                              // working, the placeholder needed to be in ()
                              if (err_2)
                                  throw new Error("query failure : ", err_2);
                          }
                      );
                      viewEmployees();
                      promptUser();
                  });
          }
      );
  });
}

//Update
employeeArr = [];
function updateEmployeeRole() {
  db.query(`Select * From company_db.employee;`, async function (err, results) {
    results.forEach((result) =>
      employeeArr.push({
        name: result.first_name + " " + result.last_name,
        value: result.id,
      })
    );
    const data = await inquirer
          .prompt([
              {
                  type: "list",
                  name: "employeeList",
                  choices: employeeArr,
                  message: "Please select an employee to update",
              },
              {
                  type: "input",
                  name: "updateVal",
                  message: "Please enter a role number",
              },
          ]);
      var { employeeList, updateVal } = data;
      var [value] = employeeArr;
      console.log("Irvin", employeeList);
      console.log("Irvin2", updateVal);
      console.log("Irvin3", value.value);
      db.query(
          `UPDATE company_db.employee set role_id = ${Number(
              updateVal
          )} where id = ${employeeList} ;`,
          function (err_1, results_1) {
              if (err_1)
                  throw new Error("query failure : ", err_1);
          }
      );
      displayEmployeeTable();
  });
}
//Delete
function deleteDepartment() {
  db.query(`SELECT * FROM company_db.department;`, function (err, results) {
    let departArray = [];
    results.forEach((result) =>
      departArray.push({ name: result.name, value: result.id })
    );
    return inquirer
      .prompt([
        {
          type: "list",
          name: "deleteDepartment",
          message: "Please choice a department to delete?",
          choices: departArray,
        },
      ])
      .then((data) => {
        db.query(
          `DELETE FROM department WHERE id = ${data.deleteDepartment};`,
          function (err, results) {
            promptUser();
          }
        );
      });
  });
}
function deleteRole() {
  db.query(`SELECT * FROM company_db.role;`, async function (err, results) {
    let rolArray = [];

    results.forEach((result) =>
      rolArray.push({ name: result.title, value: result.id })
    );

    const data = await inquirer
          .prompt([
              {
                  type: "list",
                  name: "deleteRole",
                  message: "Please choice a role to delete?",
                  choices: rolArray,
              },
          ]);
      db.query(
          `DELETE FROM company_db.role WHERE id = ${data.deleteRole};`,
          function (err_1, results_1) {
              promptUser();
          }
      );
  });
}
function deleteEmployee() {
  db.query(`SELECT * FROM company_db.employee;`, async function (err, results) {
    let empArray = [];

    results.forEach((result) =>
      empArray.push({
        name: result.first_name + " " + result.last_name,
        value: result.id,
      })
    );

    const data = await inquirer
          .prompt([
              {
                  type: "list",
                  name: "deleteEmployee",
                  message: "Please choice a employee to delete?",
                  choices: empArray,
              },
          ]);
      db.query(
          `DELETE FROM company_db.employee WHERE id = ${data.deleteEmployee};`,
          function (err_1, results_1) {
              promptUser();
          }
      );
  });
}
