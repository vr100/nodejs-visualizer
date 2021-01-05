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

function getBallReceiverData(data, game, play) {
  var newData = {};
  for (var i = 0; i < data.length; i = i + 1) {
    if (data[i]["gameId"].toString() !== game ||
      data[i]["playId"].toString() !== play) {
      continue;
    }
    var newDataMap = {};
    var rank = "-1";
    for (var key in data[i]) {
      if (key === "gameId" || key === "playId") {
        continue;
      }
      if (key === "rank") {
        rank = data[i][key];
        continue;
      }
      newDataMap[key] = data[i][key];
    }
    newData[rank] = newDataMap;
  }
  return newData;
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
  var frameRegex = /^\d+\.json$/
  var frameFiles = folderContent.filter(file => frameRegex.test(file));
  var receiverData = JSON.parse(fs.readFileSync(inputConfig.receiverFile, "utf-8"));
  receiverData = getBallReceiverData(receiverData, game, play);
  var data = {game: game, play: play, folder: folder,
    frameCount: frameFiles.length, ballReceiver: receiverData};
  var jsonData = JSON.stringify(data);
  res.render("display.pug", {data: jsonData})
}
