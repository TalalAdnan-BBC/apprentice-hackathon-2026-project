var express = require('express');
const { login } = require('../database');
var router = express.Router();
const app = express();

/* GET home page. */

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const result = await login(username, password);

  if (result >= 0) {
    res.cookie("userID", result.toString(), 9000000);
    res.render("index", { title: "Test" });
  }
})

app.get('/', function(req, res, next) {
  /*const chartData = {
    labels: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'],
    values: [45, 25, 15, 10, 5]
  };*/

  // const user = req.cookies("userID");
  const { userID } = req.cookies;

  

  res.render('index', { title: 'Express', userID: userID }); //{ data: chartData }
});

app.get('/leaderboard', (req, res) => {
  res.render('leaderboard', { title: 'Leaderboard' });
});

// 3. Contact Route
app.get('/milestones', (req, res) => {
  res.render('milestones', { title: 'Milestones' });
});

// 3. Contact Route
const { connectDB, getOTJsFromUser } = require("../database");
const { ksbList } = require("../otj-export");

app.get('/otjLog', async (req, res) => {
    const db = await connectDB();

    const userID = 1;

    const logs = await getOTJsFromUser(db, userID);

    for (const log of logs) {
        log.ksbs = await ksbList(log.otjID);
    }

    res.render('otjLog', {
        title: 'OTJ Log',
        logs
    });
});
/*%app.get("/", async (req,res) => {
  const projects = await db.query(SELECT this.name, progress FROM projects);
  res.render("index", {
    projects: projects.rows
  });
});*/

module.exports = app;
