var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var dbHelper = require('./dbHelper.js');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

app.use(express.static('src/client'));
app.use(bodyParser.json());

var Twit = require('twit');
var T = new Twit({
  consumer_key:         'ERAKvb3RQEiKKovdTgr3QadOH',
  consumer_secret:      'Ah03sBHpCWD51n0t5gvO6nKv5mx06JazdheL1ArMnb7xEJ7qFK',
  access_token:         '1149004722-aXRhWGNykNLm9NGX7qN5MqD9OMONxMJVucpB63N',
  access_token_secret:  'qTxVZZZhVYGJSfXNXj4L4bTvBuMuANEnrIEDRYhLa6dLJ'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/add/hash', function(req, res){
  console.log('add/hash');
  dbHelper.addHash(req.body, res);
});

app.post('/delete/hash', function(req, res){
  dbHelper.deleteHash(req.body, res);
})

app.get('/get/hashes', function(req, res){
  dbHelper.getHashes(req, res);
});

app.get('/get/trending', function(req, res){
  let hashTags = [];
  T.get('trends/place', { id: 23424977 }, function(err, data, response){
    data[0].trends.forEach(function(element, idx){
      if(element.name[0] === "#"){
        hashTags.push(element);
      }
    })
    res.status(200).send(hashTags)
  })
})

app.post('/get/tweets', function(req, res){
  var tweetArray = [];
  T.get('search/tweets', { q: req.body.hashtag, lang: "en", count: 5 }, function(err, data, response){
    for(var i = 0; i < data.statuses.length; i++){
      var tweetObject = {
        text: data.statuses[i].text,
        name: data.statuses[i].user.name,
        screenName: "@" + data.statuses[i].user.screen_name,
        image: data.statuses[i].user.profile_image_url
      }
      tweetArray.push(tweetObject)
    }
    res.status(200).send(tweetArray);
  });
});
