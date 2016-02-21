const low = require('lowdb');
const storage = require('lowdb/file-async');
 
const db = low('db.json', { storage : storage });

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/score/:username', function(req, res){
  const score = db('scores').find({ username: req.params.username })
  res.send(score);
});
 
app.post('/score', function(req, res){
  console.log(req.body);
  db('scores')
    .push(req.body)
    .then(function(score){
        res.send(score);
    });
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});