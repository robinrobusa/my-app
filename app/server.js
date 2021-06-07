var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser')
//var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, "index.html"))
});

app.listen(3000, function() {
  console.log("App listening on port 3000!");
});

//Test
app.get('/test', function (req, res) {
  res.json({
      status: 'API Its Working',
      message: 'Welcome to RESTHub crafted with love!'
  });
});

// Get request
app.get('/get-profile', function(req, res) {
  var response = res;
  MongoClient.connect("mongodb://admin:password@localhost:27017",{useNewUrlParser: true,useUnifiedTopology: true}, function (err, client) {
    if(err) throw err;

    var db = client.db("my-db");
    var query = {userid: 1};
    db.collection('users').findOne(query, function(err, result) {
        if(err) throw err;
        client.close();
        response.send(result);
    });
  });
});

// Post request: Update
app.post('/update-profile', function(req, res) {
  var userObj = req.body;
  console.log("Post: =>"+req.body);
  var response = res;

  MongoClient.connect("mongodb://admin:password@localhost:27017",{useNewUrlParser: true,useUnifiedTopology: true}, function (err, client) {
    if(err) throw err;

    var db = client.db("my-db");
    userObj['userid'] = 1;
    var query = {userid: 1};
    var newValues = {$set: userObj};

    db.collection('users').updateOne(query, newValues,{upsert: true}, function(err, res) {
        if(err) throw err;
        console.log("Updated!!!");
        client.close();
        response.send(userObj);
    });
  });
});
