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
                console.log(err);
                res.json({
                    status: "ERROR",
                    msg: err
                });
            }
            console.log(docs);
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
                    console.log(err);
                    res.json({
                        status: "ERROR",
                        msg: err
                    });
                }
                console.log(docs);
                console.log("Found competitions and send it back now");
                res.json({
                    data: docs,
                    status: "OK"
                })
            })
    }
});

router.get('/getReports', function(req, res) {
    Competition.find({
        'done': true
    }, function(err, docs) {
        if (err) {
            console.log(err);
            res.json({
                status: "ERROR",
                msg: err
            });
        }
        console.log(docs);
        if (docs.length > 0) {
            var tmp = [];
            for (var doc in docs){
                docs[doc].report.push(docs[doc].name);
                tmp.push(docs[doc].report);
            }
            console.log(tmp);
            res.json({
                data: tmp,
                status: "OK"
            })
        } else{
            res.json({
                status: "NOT FOUND",
                msg: "Competition not found"
            });
        }
    })
});

router.post('/newOrUpdate', function(req, res) {
    //date should be unix timestamp
    console.log(req.body.data);

    var data = req.body.data;

    //first check if already exists --> then just update
    Competition.findOne({id:data.id}, function (err, doc) {
        if (err) {
            console.log(err);
            res.json({
                status: "ERROR",
                msg: err
            });
        }

        if(doc){
            //just update
            console.log(doc);
            console.log(data);
            doc.name = data.name;
            doc.date = data.date;
            doc.place = data.place;
            doc.description = data.description;
            doc.done = data.done;
            doc.members = data.members;
            doc.report = data.report;

            console.log(doc);
            doc.save();
            res.json({
                data: doc,
                status: "OK"
            })

        }else {
            var newCompetition = new Competition(data);
            newCompetition.save(function(err, competition) {
                if (err) return console.error(err);
                console.log(competition);
            });
            res.json({
                data: newCompetition,
                status: "OK"
            })
        }
    })
});

router.post('/newComment', function(req, res) {
    //date should be unix timestamp
    console.log(req.body);
    var id = req.body.id;
    var username = req.body.username;
    var message = req.body.message;

    Competition.find({
        "id": id
    }, function(err, doc) {
        if (err) {
            console.log(err);
            res.json({
                status: "ERROR",
                msg: err
            });
        }

        var error = null;

        try {
            if (doc.length > 0) {
                console.log(doc[0]);
                doc[0].comments.push({
                    username: username,
                    message: message
                });
                doc[0].save();
            } else {
                console.error("Couldnt find requested Competition");
                error = "Couldnt find requested Competition";
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