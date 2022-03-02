
const inquirer = require('inquirer');

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const cTable = require('console.table');
const { result } = require('lodash');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'mysql2022',
    database: 'employee_db'
  });

var queryString;

function viewDepartments(){
      queryString= "SELECT * from department";
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        //console.log(results);
        console.table(results);
        //return results;
    });
}
function viewRoles(){
    queryString= "SELECT * from role";
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        console.table(results);
    });
}
function viewEmployees(){
    queryString= "SELECT * from employee";
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        console.table(results);
        //return results;
    });
}





function addDepartment(id, name){
    queryString= `INSERT INTO department (id,name) VALUES (${parseInt(id)}, "${name}")`;
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        return "Department Added Successfully";
    });
}
function addRole(id, title, salary, dept_id){

    queryString= `INSERT INTO role (id,title,salary,department_id) VALUES (${parseInt(id)},"${title}",${parseInt(salary)},${parseInt(dept_id)})`;
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        return "Role Added Successfully";
    });

}
function addEmployee(id,first_name,last_name,role_id,manager_id){
    if(manager_id==null){
        queryString= `INSERT INTO employee (id,first_name,last_name,role_id) VALUES (${parseInt(id)},"${first_name}","${last_name}",${parseInt(role_id)})`;    
    }
    else{
        queryString= `INSERT INTO employee (id,first_name,last_name,role_id,manager_id) VALUES (${parseInt(id)},"${first_name}","${last_name}",${parseInt(role_id)},${parseInt(manager_id)})`;
    }
    
    db.query(queryString,(err,results)=>{
        if(err){
            throw err;
        }
        return "Employee Added Successfully";
    });

}
function updateEmployeeRole(){}


function initialPrompt(){return inquirer.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: ['View all departments', 'View all roles', 'View all employees','Add a department','Add an employee','Add a role','Update an employee role'],
    },
    ]);
  };

  function deptPrompt(){return inquirer.prompt([
    {
        type: 'input',
        name: 'dept_name',
        message: "What's the department name?",
      },
    ]);
  };

  function rolePrompt(){return inquirer.prompt([
    {
        type: 'input',
        name: 'role_title',
        message: "What's the role title?",
      },
      {
        type: 'input',
        name: 'role_salary',
        message: "What's the role salary?",
      },
      //still has to let user choose department by displaying the names in a list
    ]);
  };


  async function init(){

    var answers = await initialPrompt();

    switch(answers.choice) {
        case "View all departments":
            viewDepartments();
          break;
        case "View all roles":
          // code block
          viewRoles();
          break;
          case "View all employees":
          // code block
          viewEmployees();
          break;
          case "Add a department":
          console.log(addDepartment(1,'IT'));
          break;
          case "Add a role":
          // code block
          console.log(addRole(1,"Software Engineer",70000,1));
          break;
          case "Add an employee":
          // code block
          console.log(addEmployee(1,"Mona","Mahmoud",1));
          break;
          case "Update an employee role":
          // code block
          break;
        
      }

  }

  init();