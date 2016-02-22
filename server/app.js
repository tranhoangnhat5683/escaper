const low = require('lowdb');
const storage = require('lowdb/file-async');
 
const db = low('db.json', { storage : storage });

var express = require('express');
var app = express();
var cors = require('cors')

app.use(cors());
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/score/top', function(req, res){
    var top = db('scores')
      .chain()
      .sortBy('score')
      .reverse()
      .take(10)
      .value();
    res.send(top);
});

app.get('/score/:username', function(req, res){
  const scores = db('scores').filter({ username: req.params.username })
  res.send(scores);
});
 
app.post('/score', function(req, res){
  var data = req.body;
  data.score = parseInt(data.score);
  
  db('scores')
    .push(req.body)
    .then(function(score){
        res.send(score);
    });
});

  
app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});