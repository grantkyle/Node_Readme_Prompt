const inquirer = require("inquirer")
const fs = require("fs")
let data = {}
const axios = require("axios")
const PDFDocument = require("pdfkit")
const markdownpdf = require("markdown-pdf")
// What is your GitHub username? <user_will_provide_github_username>
// What is your project's name?
// Please write a short description of your project?
// What kind of license should your project have? User can choose from list of items
// What command should be run to install dependencies? (default to "npm i" if user doesn't respond)
// What command should be run to run tests? (default to "npm test" if user doesn't respond)
// What does the user need to know about using the repo?
// What does the user need to know about contributing to the repo?
function askQuestion() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is your Github username?",
            name: "userName"
        },
        {
            type: "input",
            message: "What is your project's name?",
            name: "projectName"
        },
        {
            type: "input",
            message: "Please write a short description of your project",
            name: "description"
        },
        {
            type: "input",
            message: "What kind of license should your project have?",
            name: "license"
        },
        {
            type: "input",
            message: "What command should be run to install dependencies?",
            name: "command"
        },
        {
            type: "input",
            message: "What command should be run to run tests?",
            name: "runTest"
        },
        {
            type: "input",
            message: "What does the user need to know about using the repo?",
            name: "repo"
        }
    ]).then(function (input) {

        data.userName = input.userName
        data.projectName = input.userName
        data.description = input.description
        data.license = input.license
        data.command = input.command
        data.runTest = input.runTest
        data.repo = input.repo

        let userName = data.userName
        let queryurl = "https://api.github.com/users/" + userName
        let license = data.license
        if (license == 'Apache 2.0') {
            license = `[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`;
        }
        axios.get(queryurl).then(function (response) {

            data.avatar_url = response.data.avatar_url
            let body = `
* __User Name__: ${data.userName}
* __Project Name__: ${data.projectName}
* __Description__: ${data.description}
* __License__: ${data.license}
* __Command__: ${data.command}
* __Run Test__: ${data.runTest}
* repo: ${data.repo}
![${data.userName}'s pic](${data.avatar_url})
`
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream('output.pdf'));
            doc
                .fontSize(25)
                .text('README Project', 100, 100);
            doc.end();

            
            fs.writeFile("README.md", license + body, function (error) {
                if (error) {
                    console.log(error)
                }
                markdownpdf()
                .from("README.md")
                .to("READMEtoPDF.pdf", function () {
                    console.log("Done")
                })
                    console.log("success")
                })

            })
        })
    }

askQuestion()