const inquirer = require("inquirer");

const express = require("express");
// Import and require mysql2
//const mysql = require('mysql2');
const mysql = require("mysql2/promise");

const cTable = require("console.table");
const { result } = require("lodash");
const { arrayBuffer } = require("stream/consumers");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var queryString;

async function viewDepartments() {
    queryString = "SELECT * from department";
    const [results] = await db.query(queryString);
    return results;
}

//   return new Promise(resolve => {
//     db.query(queryString, function (err, result) {
//         if (err) throw err;
//         resolve(true);
//     });
// });

// db.query(queryString,(err,results)=>{
//     if(err){
//         throw err;
//     }
//     //console.log(results);
//     if(view){
//     console.table(results);
//     }
//     return results;
// });

// if(view){
//     console.table(results);
//     }

async function getRolesNames() {
    queryString = "SELECT id, title AS name from role";
    const [results] = await db.query(queryString);
    return results;
}

async function getEmployeesNames() {
    queryString = "SELECT CONCAT(`first_name`, ' ', `last_name`) AS name FROM employee";
    const [results] = await db.query(queryString);
    return results;
}

async function viewRoles() {
    queryString = "SELECT * from role";
    const [results] = await db.query(queryString);
    return results;
}

// async function viewRoleNames() {
//     queryString = "SELECT * from role";
//     const [results] = await db.query(queryString);
//     return results;
// }

async function viewEmployees() {
    queryString = "SELECT * from employee";
    const [results] = await db.query(queryString);
    return results;
}

// function getNames(results) {
//     Object.keys(results).forEach(function(key) {
//         // var names = [];
//         // var row = results[key];
//         // names.push(row.name);
//         // return names;
//         var pairs = [];
//         var row = results[key];
//         pairs.push({ id: `${row.id}`, name: `row.name` });
//         console.log(row.name);
//         console.log(row.id);
//         console.log(pairs);

//         inquirer.prompt([{
//             type: "list",
//             name: "dept_name",
//             message: "What's the department name?",
//             choices: pairs,
//         }, ]);

//         return pairs;
//     });
// }

async function addDepartment(name) {
    //console.log(name);
    queryString = `INSERT INTO department (name) VALUES ("${name}")`;
    const [results] = await db.query(queryString);
    return results;
}

async function getDeptId(name) {
    queryString = `SELECT id FROM department where name = ("${name}")`;
    const [results] = await db.query(queryString);
    return results[0].id;
}

async function getRoleId(name) {
    queryString = `SELECT id FROM role where title = ("${name}")`;
    const [results] = await db.query(queryString);
    return results[0].id;
}

async function getManagerId(name) {
    const nameArray = name.split(" ");
    queryString = `SELECT id FROM employee where first_name = "${nameArray[0]}" AND last_name = "${nameArray[1]}"`;
    const [results] = await db.query(queryString);
    return results[0].id;
}

async function addRole(title, salary, dept_id) {
    queryString = `INSERT INTO role (title,salary,department_id) VALUES ("${title}",${parseInt(salary)},${parseInt(dept_id)})`;
    const [results] = await db.query(queryString);
    return results;
}

async function addEmployee(first_name, last_name, role_id, manager_id) {
    if (manager_id == null) {
        queryString = `INSERT INTO employee (first_name,last_name,role_id) VALUES ("${first_name}","${last_name}",${parseInt(role_id)})`;
    } else {
        queryString = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${first_name}","${last_name}",${parseInt(role_id)},${parseInt(manager_id)})`;
    }

    const [results] = await db.query(queryString);
    return results;
}

async function updateEmployeeRole(empId, roleId) {

    queryString = `UPDATE employee SET role_id = ${parseInt(roleId)} where id = ${parseInt(empId)}`;


    const [results] = await db.query(queryString);
    return results;

}

function initialPrompt() {
    return inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add an employee",
            "Add a role",
            "Update an employee role",
            "Nothing now, thanks",
        ],
    }, ]);
}

function deptPrompt() {
    return inquirer.prompt([{
        type: "input",
        name: "dept_name",
        message: "What's the department name?",
    }, ]);
}


function empSecondPrompt(roles, msg) {
    return inquirer.prompt([{
        type: 'list',
        message: msg,
        choices: roles,
        name: "role_name"
    }]);
}

function empThirdPrompt() {
    return inquirer.prompt([{
        type: "list",
        message: "Would you like to assign a manager to this employee?",
        name: "choice",
        choices: [
            "Yes",
            "No",
        ],
    }, ]);
}

function empFourthPrompt(managers, msg) {
    return inquirer.prompt([{
        type: 'list',
        message: msg,
        choices: managers,
        name: "manager_name"
    }]);
}

function empFirstPrompt() {
    return inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What's the employee first name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What's the employee last name?",
        },
    ]);
}


function roleSecondPrompt(departments) {
    return inquirer.prompt([{
        type: 'list',
        message: 'Select a department from the list',
        choices: departments,
        name: "dept_name"
    }]);
}

function roleFirstPrompt() {
    return inquirer.prompt([{
            type: "input",
            name: "role_title",
            message: "What's the role title?",
        },
        {
            type: "input",
            name: "role_salary",
            message: "What's the role salary?",
        },
    ]);
}

var db;
async function init() {
    // Connect to database
    db = await mysql.createConnection({
        host: "localhost",
        // MySQL username,
        user: "root",
        // TODO: Add MySQL password here
        password: "mysql2022",
        database: "employee_db",
    });
    done = "";
    while (done != "Nothing now, thanks") {
        var answers = await initialPrompt();
        done = answers.choice;
        switch (answers.choice) {
            case "View all departments":
                console.table(await viewDepartments());
                break;
            case "View all roles":
                console.table(await viewRoles());
                break;
            case "View all employees":
                console.table(await viewEmployees());
                break;
            case "Add a department":
                answers = await deptPrompt();
                await addDepartment(answers.dept_name);
                break;
            case "Add a role":
                answers = await roleFirstPrompt();
                roleName = answers.role_title;
                roleSalary = answers.role_salary;
                answers = await roleSecondPrompt(await viewDepartments());
                await addRole(roleName, parseInt(roleSalary), await getDeptId(answers.dept_name));
                break;
            case "Add an employee":
                answers = await empFirstPrompt();
                firstName = answers.firstName;
                lastName = answers.lastName;
                answers = await empSecondPrompt(await getRolesNames(), 'Select a role from the list');
                // console.log(answers.role_name);
                roleId = await getRoleId(answers.role_name);
                //console.log("RoleName:" + roleName);
                answers = await empThirdPrompt();
                if (answers.choice == "Yes") {
                    answers = await empFourthPrompt(await getEmployeesNames(), 'Select a manager from the list');
                    managerId = await getManagerId(answers.manager_name);
                    await addEmployee(firstName, lastName, roleId, managerId);
                } else if (answers.choice == "No") {
                    await addEmployee(firstName, lastName, roleId, null);
                }

                //await addEmployee(firstName, lastName, await getDeptId(answers.dept_name));
                break;
            case "Update an employee role":
                answers = await empFourthPrompt(await getEmployeesNames(), 'Which employee would you like to update his/her role?');
                empId = await getManagerId(answers.manager_name);
                answers = await empSecondPrompt(await getRolesNames(), 'Which role would you like to assign?');
                roleId = await getRoleId(answers.role_name);
                await updateEmployeeRole(empId, roleId);
                break;

                // case "Nothing now, thanks":
                //     done = true;
                //     break;
        }
    }
}

init();

// function updateRoleFirstPrompt(roleNames) {
//     return inquirer.prompt([{
//         type: 'list',
//         message: ,
//         choices: roleNames,
//         name: "emp_name"
//     }]);
// }