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
  res.render('index', { title: 'Express' }); //{ data: chartData }
});

app.get('/leaderboard', (req, res) => {
  res.render('leaderboard', { title: 'Leaderboard' });
});

// 3. Contact Route
app.get('/milestones', (req, res) => {
  res.render('milestones', { title: 'Milestones' });
});

// 3. Contact Route
app.get('/otjLog', (req, res) => {
  res.render('otjLog', { title: 'OTJ Log' });
});

/*%app.get("/", async (req,res) => {
  const projects = await db.query(SELECT this.name, progress FROM projects);
  res.render("index", {
    projects: projects.rows
  });
});*/

module.exports = app;
