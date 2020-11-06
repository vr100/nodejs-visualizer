paper.install(window);

function drawLine(start, end, width = 3) {
  var path = new paper.Path({
    segments: [start, end],
    strokeColor: 'black',
    strokeWidth: width
  });
}

function drawField(scale) {

  var fieldWidth = 120;
  var fieldHeight = 53;
  var startX = 50;
  var startY = 100;
  var yardlineWidth = 10;
  var endzoneWidth = 10;

  // Field
  var leftTop = new paper.Point(startX, startY);
  var rightTop = new paper.Point(startX + fieldWidth * scale, startY);
  var rightBottom = new paper.Point(startX + fieldWidth * scale,
    startY + fieldHeight * scale);
  var leftBottom = new paper.Point(startX, startY + fieldHeight * scale);
  drawLine(leftTop, rightTop);
  drawLine(rightTop, rightBottom);
  drawLine(rightBottom, leftBottom);
  drawLine(leftBottom, leftTop);

  // Home endzone
  var top = new paper.Point(startX + endzoneWidth * scale, startY)
  var bottom = new paper.Point(startX + endzoneWidth * scale,
    startY + fieldHeight * scale);
  drawLine(top, bottom);

  // 10 Yard lines (draw 9 thin lines)
  var yardline = endzoneWidth
  for (var i = 0; i < 9; i = i + 1) {
    yardline = yardline + yardlineWidth
    var top = new paper.Point(startX + yardline * scale, startY);
    var bottom = new paper.Point(startX + yardline * scale,
      startY + fieldHeight * scale);
    drawLine(top, bottom, 1);
  }

  // Visitor endzone
  var visitorendline = fieldWidth - endzoneWidth
  var top = new paper.Point(startX + visitorendline  * scale, startY)
  var bottom = new paper.Point(startX + visitorendline * scale,
    startY + fieldHeight * scale);
  drawLine(top, bottom);

  paper.view.draw();
}

function draw() {
  var scale = 6;
  var canvas = document.getElementById("drawCanvas");
  paper.setup("drawCanvas");
  drawField(scale)
  paper.project.remove();
}