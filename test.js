var express = require('express');
var app = express();
var exec = require('child_process').exec;

app.use('/vendor', express.static('bower_components'));
app.use('/', express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/actualizar', function (req, res) {
  var cmd = "git pull";
  exec(cmd, function(error, stdout, stderr) {
    res.send(stdout);
  });
})
