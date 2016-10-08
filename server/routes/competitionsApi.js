var express = require('express');
var router = express.Router();
var passport = require('passport');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('../flow-node-comp.js')('../client/public/img/competitions');

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


// Handle picture uploads through Flow.js
router.post('/upload', multipartMiddleware, function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {

    //when we want a specific Competitions
        res.status(/^(partly_done|done)$/.test(status) ? 200 : 500).send();
    });
});


// Handle status checks on chunks through Flow.js
router.get('/upload', function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);

        if (status == 'found') {
            status = 200;
        } else {
            status = 204;
        }

        res.status(status).send();
    });
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

module.exports = router;