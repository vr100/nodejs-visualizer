exports.home = (req, res) => {
  var data = {num: 1, value: "value"}
  var jsonData = JSON.stringify(data)
  res.render('home.pug', { data: jsonData})
}