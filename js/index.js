const express = require('express');
const pug = require('pug');
const routes = require('./routes/routes');
const path = require('path');
const app = express();
const appController = require("./controllers/appController.js");
const PORT = 8080;

app.set('view engine', pug);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(express.static(path.join(__dirname, '/public')));

appController.init();

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
module.exports = app;
