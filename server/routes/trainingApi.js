var express = require('express');
var router = express.Router();
var passport = require('passport');

var Training = require('../models/training.js');


router.post('/register', function(req, res) {
  //date should be unix timestamp
  var date = new Date(req.body.date);
  console.log(req.body);
  var status = req.body.status;
  var username = req.body.username;
  var food = req.body.food;
  var drink = req.body.drink;

  Training.find({
    "date": date
  }, function(err, doc) {
    if (err) {
      console.log(err)
      res.json({
        status: "ERROR",
        msg: err
      });
    };

    var error = null;

    try {
      if (doc.length > 0) {
        if (doc[0]["appear"].indexOf(username) > -1) {
          doc[0]["appear"].splice(doc[0]["appear"].indexOf(username), 1);
        };
        if (doc[0]["maybe"].indexOf(username) > -1) {
          doc[0]["maybe"].splice(doc[0]["maybe"].indexOf(username), 1);
        }
        if (doc[0]["not"].indexOf(username) > -1) {
          doc[0]["not"].splice(doc[0]["not"].indexOf(username), 1);
        }
        doc[0][status].push(username);
        //clear the food/drink to "overwrite" choices of the past
        if (doc[0].food.username === username) {
          doc[0].food = {
            supplied: false,
            'username': ""
          }
        }
        if (doc[0].drink.username === username) {
          doc[0].drink = {
            supplied: false,
            'username': ""
          }
        }
        if (food) {
          doc[0].food = {
            supplied: food,
            'username': username
          }
        };
        if (drink) {
          doc[0].drink = {
            supplied: drink,
            'username': username
          }
        };
        doc[0].save();
        console.log(doc[0]);
      } else {
        console.error("Couldnt find requested Training");
        error = "Couldnt find requested Training";
      }
    } catch (e) {
      error = e.message;
      console.error(e.message);
    } finally {
      if (error !== null) {
        res.json({
          status: 'ERROR',
          msg: error
        });
      } else {
        res.json({
          status: 'OK',
          data: doc[0]
        });
      }
    }

  });
});

router.post('/get', function(req, res) {
  //date should be unix timestamp
  console.log(req.body.date);
  var date = req.body.date;
  console.log(date);
  Training.find({
    "date": date
  }, function(err, docs) {
    if (err) {
      console.log(err)
      res.json({
        status: "ERROR",
        msg: errs
      });
    }
    console.log(docs)
    if (docs.length > 0) {
      console.log("Found training and send it back now");
      res.json({
        data: docs[0],
        status: "OK"
      })
    } else {
      console.log("Created new Training for timestamp:" + date)
      var newTraining = new Training({
        date: date,
        food: {
          supplied:false,
          username:""
        },
        drink: {
          supplied:false,
          username:""
        },
        appear: [],
        maybe: [],
        not: []
      });
      newTraining.save(function(err, training) {
        if (err) return console.error(err);
        console.log(training);
      });
      console.log(newTraining)
      res.json({
        data: newTraining,
        status: "OK"
      })
    }
  })
});

router.post('/newComment', function(req, res) {
  //date should be unix timestamp
  console.log(req.body);
  var trainingDate = new Date(req.body.trainingDate);
  var createDate = req.body.createDate;
  var username = req.body.username;
  var message = req.body.message;

  Training.find({
    "date": trainingDate
  }, function(err, doc) {
    if (err) {
      console.log(err)
      res.json({
        status: "ERROR",
        msg: err
      });
    };

    var error = null;

    try {
      if (doc.length > 0) {
        console.log(doc[0])
        doc[0].comments.push({
          username: username,
          message: message,
          createDate: createDate
        })
        doc[0].save();
      } else {
        console.error("Couldnt find requested Training");
        error = "Couldnt find requested Training";
      }
    } catch (e) {
      error = e.message;
      console.error(e.message);
    } finally {
      if (error !== null) {
        res.json({
          status: 'ERROR',
          msg: error
        });
      } else {
        res.json({
          status: 'OK'
        });
      }
    }

  });

});

module.exports = router;