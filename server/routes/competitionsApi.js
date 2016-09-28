var express = require('express');
var router = express.Router();
var passport = require('passport');

var Competition = require('../models/competition.js');


router.post('/get', function(req, res) {
  //date should be unix timestamp
  console.log(req.body.id);
  var id = req.body.id ;

  //when we want a specific Competitions
  if (id !== "all") {
    Competition.find({
      "id": id
    }, function(err, docs) {
      if (err) {
        console.log(err)
        res.json({
          status: "ERROR",
          msg: err
        });
      }
      console.log(docs)
      if (docs.length > 0) {
        console.log("Found competition and send it back now");
        res.json({
          data: docs,
          status: "OK"
        })
      } else{ 
        res.json({
          status: "NOT FOUND",
          msg: "Competition not found"
        });
      }
    })
  }else{
    Competition.find({}, 
      function(err, docs) {
      if (err) {
        console.log(err)
        res.json({
          status: "ERROR",
          msg: err
        });
      }
      console.log(docs)
      console.log("Found competitions and send it back now");
      res.json({
        data: docs,
        status: "OK"
      })
    })
  }
});

router.post('/new', function(req, res) {
  //date should be unix timestamp
  console.log(req.body.data);
  var data = req.body.data;

  var newCompetition = new Competition(data);
      newCompetition.save(function(err, competition) {
        if (err) return console.error(err);
        console.log(competition);
      });
      res.json({
        data: newCompetition,
        status: "OK"
      })
});

module.exports = router;