const fs = require("fs");
const path = require("path");
const CONFIG_PATH = "input.config";

var inputConfig = {};

exports.init = () => {
  var data = fs.readFileSync(CONFIG_PATH, "utf-8");
  var config = JSON.parse(data);
  inputConfig = config;
  console.log(`Input configuration: ${JSON.stringify(inputConfig)}`)
}

exports.home = (req, res) => {
  res.render("home.pug");
}

exports.showPlay = (req, res) => {
  var game = req.body.game;
  var play = req.body.play;
  var folder = path.join(inputConfig.folder, game, play);
  var folderExists = fs.existsSync(folder);
  if (!folderExists) {
    res.render("error.pug", { game: game, play: play});
    return;
  }
  var folderContent = fs.readdirSync(folder);
  var jsonFiles = folderContent.filter(file => file.endsWith(".json"));
  var data = {game: game, play: play, folder: folder,
    frameCount: jsonFiles.length};
  var jsonData = JSON.stringify(data);
  res.render("display.pug", {data: jsonData})
}
