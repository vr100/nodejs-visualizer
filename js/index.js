const express = require("express");
const pug = require("pug");
const routes = require("./routes/routes");
const path = require("path");
const appController = require("./controllers/appController.js");
const wsController = require("./controllers/wsController.js");

const app = express();
const PORT = 8080;

app.set("view engine", pug);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
app.use(express.static(path.join(__dirname, "/public")));

appController.init();
const wsServer = wsController.startServer();

const server = app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit("connection", socket, request);
  });
});

module.exports = app;
