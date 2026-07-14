const express = require('express');
const app = express(); //module.exports = express.createServer;
const port = 3000;

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;