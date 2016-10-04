var express = require('express');
var router = express.Router();
var passport = require('passport');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flowUser = require('../flow-node.js')('../client/public/img/profiles');
var fs = require("fs");
var User = require('../models/user.js');


router.post('/register', function(req, res) {
    User.register(new User({
            username: req.body.username,
            forename: req.body.forename,
            surname: req.body.surname
        }),
        req.body.password,
        function(err, account) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function() {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Fehler beim Einloggen'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

router.get("/getCurrentUser", function(req, res) {
    if (req.user !== null) {
        res.json(req.user);
    }
});

router.post("/saveUserData", function(req, res) {
    var data = req.body.userdata;
    User.find({
        "username": data.username
    }, function(err, docs) {
        if (err) {
            res.json({
                status: "ERROR",
                msg: errs
            });
        }
        if (docs.length > 0) {
            for(var key in data){
                if(data.hasOwnProperty(key)) {
                    docs[0][key] = data[key]
                }
            }
            docs[0].save();
            res.json({status:"ok"});
        } else {
            console.log("Cant find user "+name);
        }
    })
});

router.get("/getUserData/:name", function(req, res) {
    var name = req.params.name;
    User.find({
        "username": name
    }, function(err, docs) {
        if (err) {
            console.log(err);
            res.json({
                status: "ERROR",
                msg: errs
            });
        }
        if (docs.length > 0) {
            console.log("Found User and send Data");
            res.json({
                data: docs[0],
                status: "OK"
            })
        } else {
            console.log("Cant find user "+name);
        }
    })
});


router.post('/uploadImg', function (req, res) {
    console.log(req);
    console.log(req.res.user);
    console.log(req.user.picture);

    try{
        fs.unlinkSync("img/profiles/"+req.user.picture);
    }catch(e){
        console.log(e);
    }

    req.next();
});

// Handle uploads through Flow.js
router.post('/uploadImg', multipartMiddleware, function(req, res) {
    flowUser.post(req, function(status, filename, original_filename, identifier) {
        res.status(/^(partly_done|done)$/.test(status) ? 200 : 500).send();
    });
});


// Handle status checks on chunks through Flow.js
router.get('/uploadImg', function(req, res) {
    flowUser.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);

        if (status == 'found') {
            status = 200;
        } else {
            status = 204;
        }

        res.status(status).send();
    });
});



module.exports = router;