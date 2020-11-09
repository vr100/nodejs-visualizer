exports.home = (req, res) => {
  res.render("home.pug");
}

exports.showPlay = (req, res) => {
  var game = req.body.game;
  var play = req.body.play;
  var data = { game: game, play: play}
  var jsonData = JSON.stringify(data);
  res.render("display.pug", {data: jsonData})
}
