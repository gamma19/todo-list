//dependencies required for the app
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var app = express();
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();

app.use(
    auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    })
);


app.get("/login", (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged In' : 'Logged Out');
});


app.get('/profile', requiresAuth(), (req, res) => {
    res.redirect('/');
});

module.exports = router;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));
// auth router attaches /login, /logout, and /callback routes to the baseURL


//placeholders
var task = ["first placeholder", "second placeholder"];
//placeholders for completed
var complete = ["first completed task"];


//post route for adding new task 
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route
    task.push(newTask);
    res.redirect("/");
});

app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});