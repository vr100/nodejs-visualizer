paper.install(window);

function draw() {
  var canvas = document.getElementById("drawCanvas");
  paper.setup("drawCanvas");
  var path = new paper.Path();
  path.strokeColor = 'black';
  path.strokeWidth = 3
  var scale = 5
  var start = 100
  var width = 120
  var height = 53
  var leftTop = new paper.Point(start, start);
  var rightTop = new paper.Point(start + width * scale, start);
  var rightBottom = new paper.Point(start + width * scale,
    start + height * scale);
  var leftBottom = new paper.Point(start, start + height * scale)

  path.moveTo(leftTop);
  path.lineTo(rightTop);
  path.lineTo(rightBottom);
  path.lineTo(leftBottom);
  path.lineTo(leftTop);
  paper.view.draw();
  paper.project.remove();
}