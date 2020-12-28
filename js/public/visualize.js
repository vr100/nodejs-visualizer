paper.install(window);

const HOME_TEAM = "home";
const AWAY_TEAM = "away";
const BALL_TEAM = "football";
const HOME_COLOR = "green";
const AWAY_COLOR = "blue";
const BALL_COLOR = "red";
const OFFENCE_TEXT = "o";
const DEFENCE_TEXT = "x";
const BALL_TEXT = "#";

const TEAM_FLD = "team";
const X_FLD = "x";
const Y_FLD = "y";
const ROUTE_FLD = "route";
const POS_FLD = "position";
const EVENT_FLD = "event";
const FRAME_FLD = "frameId";

const QB_POS = "QB";
const NONE_EVENT = "None";

const startX = 50;
const startY = 50;
const scale = 6;
const fieldWidth = 120;
const fieldHeight = 53.3;
const yardlineWidth = 10;
const endzoneWidth = 10;

const FRAME_RATE = 15;
const FRAME_INTERVAL = 1000 / FRAME_RATE;

function translate(x, y) {
  var newx = startX + x * scale;
  var newy = startY + (fieldHeight - y) * scale;
  return new paper.Point(newx, newy);
}

function gatherPlayerData(data) {
  var jsonData = JSON.parse(data);
  var home = [];
  var away = [];
  var offenseTeam;
  var event = NONE_EVENT;
  var ball = {};
  for(index in jsonData) {
    var d = jsonData[index];
    var x = d[X_FLD];
    var y = d[Y_FLD];
    var playerInfo = { x: x, y: y};
    var team = d[TEAM_FLD];
    var route = d[ROUTE_FLD];
    var position = d[POS_FLD];
    var frame = d[FRAME_FLD];

    event = d[EVENT_FLD];
    if (team === HOME_TEAM) {
      home.push(playerInfo);
    } else if (team === BALL_TEAM) {
      ball = playerInfo;
    } else {
      away.push(playerInfo);
    }
    if (route != null || position === QB_POS) {
      offenseTeam = team;
    }
  }
  if (event !== NONE_EVENT) {
    appendEvent(event, frame);
  }
  return { home: home, away: away, ball: ball, offense: offenseTeam }
}

function drawPlayer(x, y, color, text) {
  var text = new PointText({
    point: translate(x, y),
    fillColor: color,
    content: text,
    fontSize: "large"
  });
}

function drawPlayers(data) {
  var info = gatherPlayerData(data);
  var text = (info.offense === HOME_TEAM)? OFFENCE_TEXT: DEFENCE_TEXT;
  for (index in info.home) {
    var p = info.home[index];
    drawPlayer(p.x, p.y, HOME_COLOR, text);
  }
  text = (info.offense === AWAY_TEAM)? OFFENCE_TEXT: DEFENCE_TEXT;
  for (index in info.away) {
    var p = info.away[index];
    drawPlayer(p.x, p.y, AWAY_COLOR, text);
  }
  // draw the ball
  drawPlayer(info.ball.x, info.ball.y, BALL_COLOR, BALL_TEXT);
}

function drawLine(start, end, width = 3) {
  var path = new paper.Path({
    segments: [start, end],
    strokeColor: 'black',
    strokeWidth: width
  });
}

function drawField() {

  // Field
  var leftTop = translate(0, fieldHeight);
  var rightTop = translate(fieldWidth, fieldHeight);
  var rightBottom = translate(fieldWidth, 0);
  var leftBottom = translate(0, 0);
  drawLine(leftTop, rightTop);
  drawLine(rightTop, rightBottom);
  drawLine(rightBottom, leftBottom);
  drawLine(leftBottom, leftTop);

  // Home endzone
  var top = translate(endzoneWidth, fieldHeight);
  var bottom = translate(endzoneWidth, 0);
  drawLine(top, bottom);

  // 10 Yard lines (draw 9 thin lines)
  var yardline = endzoneWidth
  for (var i = 0; i < 9; i = i + 1) {
    yardline = yardline + yardlineWidth
    var top = translate(yardline, fieldHeight);
    var bottom = translate(yardline, 0);
    drawLine(top, bottom, 1);
  }

  // Visitor endzone
  var visitorendline = fieldWidth - endzoneWidth
  var top = translate(visitorendline, fieldHeight);
  var bottom = translate(visitorendline, 0);
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

function handleMessage(evt, ws, normalMode=true) {
  var data = JSON.parse(evt.data);
  var drawData = data.drawData;
  var nextFrameData = data.frameData;
  draw(drawData);
  if (nextFrameData.frame > nextFrameData.frameCount) {
    ws.close();
    resetPlay(nextFrameData);
    return;
  }
  if (normalMode) {
    setTimeout(function() {
      ws.send(JSON.stringify(nextFrameData));
      setFrameText(nextFrameData);
    }, FRAME_INTERVAL);
  } else {
    enableFrameButton(nextFrameData);
    ws.close();
  }
}

function startWebSocketClient(data, normalMode=true) {
  var ws = new WebSocket("ws://localhost:3030/");
  ws.onopen = function() {
    ws.send(JSON.stringify(data));
    setFrameText(data);
    if (normalMode) {
      changeToPauseMode(ws, data);
    }
  };
  ws.onmessage = function(evt) {
    handleMessage(evt, ws, normalMode)
  }
  return ws;
}

function disableButtons() {
  document.getElementById("drawButton").disabled = true;
  document.getElementById("frameButton").disabled = true;
}

function resetPlay(data) {
  changeToStartMode(data);
  resetFrameButton(data);
}

function changeToStartMode(data) {
  var message = "Start Play";
  var onclickFn = function() { showPlayFromFirst(data); };
  changeToMode(message, onclickFn);
}

function changeToPauseMode(ws) {
  var message = "Pause Play";
  var onclickFn = function() { pausePlay(ws); };
  changeToMode(message, onclickFn);
}

function changeToContinueMode(data) {
  var message = "Continue Play";
  var onclickFn = function () {
    showPlay(data);
  }
  changeToMode(message, onclickFn);
}

function changeToMode(modeMessage, onclickFn) {
  var drawButton = document.getElementById("drawButton");
  drawButton.disabled = true;
  drawButton.innerHTML = modeMessage;
  drawButton.onclick = onclickFn;
  drawButton.disabled = false;
}

function appendEvent(event, frame) {
  var divNode = document.getElementById("keyEvents");
  divNode.innerHTML += "[" + frame + "] Event: " + event + "<br/>";
}

function clearEvents() {
  document.getElementById("keyEvents").innerHTML = "";
}

function pausePlay(ws) {
  var drawButton = document.getElementById("drawButton");
  drawButton.disabled = true;
  ws.onmessage = function(evt) {
    var data = JSON.parse(evt.data);
    var nextFrameData = data.frameData;
    enableFrameButton(nextFrameData);
    ws.close();
  }
}

function showPlayFromFirst(data) {
  clearEvents();
  resetFrameText();
  data.frame = 1;
  showPlay(data);
}

function showPlay(data) {
  disableButtons();
  startWebSocketClient(data);
}

function resetFrameText() {
  document.getElementById("frameData").innerHTML = "";
}

function setFrameText(data) {
  document.getElementById("frameData").innerHTML = "Frame: " + data.frame +
    " Total frames: " + data.frameCount;
}

function resetFrameButton(data) {
  var onclickFn = function() { gotoFirstFrame(data); }
  changeFrameButton("Goto First Frame", onclickFn);
}

function enableFrameButton(data) {
  var onclickFn = function() { gotoNextFrame(data) };
  changeFrameButton("Goto Next Frame", onclickFn);
  changeToContinueMode(data);
}

function changeFrameButton(message, onclickFn) {
  var frameButton = document.getElementById("frameButton");
  frameButton.disabled = true;
  frameButton.innerHTML = message;
  frameButton.onclick = onclickFn;
  frameButton.disabled = false;
}

function gotoNextFrame(data) {
  document.getElementById("frameButton").disabled = true;
  startWebSocketClient(data, normalMode=false);
}

function gotoFirstFrame(data) {
  disableButtons();
  clearEvents();
  resetFrameText();
  data.frame = 1;
  startWebSocketClient(data, normalMode=false);
}
