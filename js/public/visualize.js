paper.install(window);

const HOME_TEXT = "home";
const AWAY_TEXT = "away";
const HOME_COLOR = "red";
const AWAY_COLOR = "blue";
const OFFENCE_TEXT = "o";
const DEFENCE_TEXT = "x";

const TEAM_FLD = "team";
const X_FLD = "x";
const Y_FLD = "y";
const ROUTE_FLD = "route";
const POS_FLD = "position";

const QB_POS = "QB";

const startX = 50;
const startY = 100;
const scale = 6;

const FRAME_RATE = 5;

function translate(x, y) {
  var newx = startX + x * scale;
  var newy = startY + y * scale;
  return new paper.Point(newx, newy);
}

function gatherPlayerData(data) {
  var jsonData = JSON.parse(data);
  var home = [];
  var away = [];
  var offenseTeam;
  for(index in jsonData) {
    var d = jsonData[index];
    var x = d[X_FLD];
    var y = d[Y_FLD];
    var playerInfo = { x: x, y: y};
    var team = d[TEAM_FLD];
    var route = d[ROUTE_FLD];
    var position = d[POS_FLD];
    if (team === HOME_TEXT) {
      home.push(playerInfo);
    } else {
      away.push(playerInfo);
    }
    if (route != null || position === QB_POS) {
      offenseTeam = team;
    }
  }
  return { home: home, away: away, offense: offenseTeam }
}

function drawPlayer(x, y, color, text) {
  var text = new PointText({
    point: translate(x, y),
    fillColor: color,
    content: text
  });
}

function drawPlayers(data) {
  var info = gatherPlayerData(data);
  var text = (info.offense === HOME_TEXT)? OFFENCE_TEXT: DEFENCE_TEXT;
  for (index in info.home) {
    var p = info.home[index];
    drawPlayer(p.x, p.y, HOME_COLOR, text);
  }
  text = (info.offense === AWAY_TEXT)? OFFENCE_TEXT: DEFENCE_TEXT;
  for (index in info.away) {
    var p = info.away[index];
    drawPlayer(p.x, p.y, AWAY_COLOR, text);
  }
}

function drawLine(start, end, width = 3) {
  var path = new paper.Path({
    segments: [start, end],
    strokeColor: 'black',
    strokeWidth: width
  });
}

function drawField() {

  var fieldWidth = 120;
  var fieldHeight = 53;
  var yardlineWidth = 10;
  var endzoneWidth = 10;

  // Field
  var leftTop = translate(0, 0);
  var rightTop = translate(fieldWidth, 0);
  var rightBottom = translate(fieldWidth, fieldHeight);
  var leftBottom = translate(0, fieldHeight);
  drawLine(leftTop, rightTop);
  drawLine(rightTop, rightBottom);
  drawLine(rightBottom, leftBottom);
  drawLine(leftBottom, leftTop);

  // Home endzone
  var top = translate(endzoneWidth, 0);
  var bottom = translate(endzoneWidth, fieldHeight);
  drawLine(top, bottom);

  // 10 Yard lines (draw 9 thin lines)
  var yardline = endzoneWidth
  for (var i = 0; i < 9; i = i + 1) {
    yardline = yardline + yardlineWidth
    var top = translate(yardline, 0);
    var bottom = translate(yardline, fieldHeight);
    drawLine(top, bottom, 1);
  }

  // Visitor endzone
  var visitorendline = fieldWidth - endzoneWidth
  var top = translate(visitorendline, 0);
  var bottom = translate(visitorendline, fieldHeight);
  drawLine(top, bottom);

}

function draw(data) {
  var canvas = document.getElementById("drawCanvas");
  paper.setup("drawCanvas");
  drawField();
  drawPlayers(data);
  paper.view.draw();
  paper.project.remove();
}

function startWebSocketClient(data) {
  var ws = new WebSocket("ws://localhost:3030/");
  var interval = 1000 / FRAME_RATE;
  ws.onopen = function() {
    ws.send(JSON.stringify(data));
  };
  ws.onmessage = function(evt) {
    var data = JSON.parse(evt.data);
    var drawData = data.drawData;
    var nextFrameData = data.frameData;
    draw(drawData);
    if (data.frame > data.frameCount) return;
    setTimeout(function() {
      ws.send(JSON.stringify(nextFrameData));
    }, interval);
  }
}

function showPlay(data) {
  document.getElementById("drawButton").disabled = true;
  data.frame = 1;
  startWebSocketClient(data);
}
