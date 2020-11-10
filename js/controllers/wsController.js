const ws = require("ws");
const fs = require("fs");
const path = require("path");
const WSPORT = 3030;

var server = null;

function handleMessage(message, socket) {
  var data = JSON.parse(message);
  var frameFile = path.join(data.folder, data.frame + ".json");
  var exists = fs.existsSync(frameFile);
  if (!exists) {
    console.log(`${frameFile} does not exist, total frames: ${data.frameCount}`);
    return;
  }
  var drawData = fs.readFileSync(frameFile, "utf-8");
  var frameData = data;
  frameData.frame = data.frame + 1;
  var jsonData = JSON.stringify({drawData: drawData, frameData: frameData})
  socket.send(jsonData);
}

exports.startServer = () => {
  if (server != null) {
    return server;
  }

  const wsServer = new ws.Server({noServer: true, port: WSPORT });
  wsServer.on("connection", socket => {
    socket.on("message", message => {
      handleMessage(message, socket);
    });
  });
  server = wsServer;
  return wsServer;
}
