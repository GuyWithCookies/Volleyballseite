app.controller('mainViewController', ['$scope', 'AuthService', 'TrainingService', function($scope, AuthService, TrainingService) {
    $scope.userpics = {};

    $scope.currTraining = {
        food: {
            supplied: false
        },
        drink: {
            supplied: false
        }
    };

    $scope.registerData = {
        food: false,
        drink: false
    };

    $scope.getNextTraining = function(setDate) {
        var date = $scope.currTraining.date || Date.today().add(2).hours();
        date = Date.parse(date);
        if(!date.is().monday()){
            console.log("Today is not monday");
            date = date.next().monday();
        }
        if (setDate) {
            date = setDate;
        }
        var timestamp = new Date(date).getTime();
        TrainingService.get(timestamp.toString()).then(function(res) {
            console.log(res);
            $scope.currTraining = res;
            //initally fetch userpics
            for(var com=0; com<$scope.currTraining.comments.length; com++){
                $scope.currTraining.comments[com].userPic = $scope.getUserPic($scope.currTraining.comments[com].username);
                console.log($scope.currTraining.comments);
            }
            console.log($scope.currTraining.date);
        });
    };

    $scope.getPrevTraining = function() {
        var date = $scope.currTraining.date || Date.today().add(2).hours();
        console.log($scope.currTraining.date);
        date = Date.parse(date);
        date = date.last().monday();
        var timestamp = new Date(date).getTime();
        TrainingService.get(timestamp.toString()).then(function(res) {
            $scope.currTraining = res;
        });
    };

    $scope.register = function(status) {
        $scope.registerData["date"] = $scope.currTraining.date;
        $scope.registerData["status"] = status;

        if (status === "not") {
            $scope.registerData.food = false;
            $scope.registerData.drink = false;
        }

        //fetch username
        AuthService.getCurrentUser().then(function(username) {
            TrainingService.register(username, $scope.registerData).then(function(res) {
                //refresh Training when success
                $scope.currTraining = res.data;
            }, function(err) {
                console.log("Something went wrong!");
                console.log(err)
            })
        }, function(err) {
            console.log("Something went wrong!");
            console.log(err)
        });
    };

    $scope.newComment = function() {
        if ($scope.message === undefined || $scope.message === "") {
            return;
        }
        if ($scope.username === undefined) {
            AuthService.getCurrentUser().then(function(username) {
                $scope.username = username;
            }, function(err) {
                console.log("Something went wrong!");
                console.log(err)
            });
        }

        var newCommentData = {
            message: $scope.message,
            createDate: Date.now(),
            trainingDate: $scope.currTraining.date
        };

        TrainingService.newComment($scope.username, newCommentData).then(function(res) {
            //refresh Training when success
            console.log(res);
            if (res.status === "OK") {
                console.log("OK");
                $scope.message = "";
                $scope.getNextTraining($scope.currTraining.date);
            }
        }, function(err) {
            console.log("Something went wrong!");
            console.log(err)
        })
    };

    $scope.getUserPic = function (username) {
        AuthService.getUserData(username).then(function (data) {
            console.log(data);
            if(!data.picture || data.picture === ""){
                tmp = "defaultUser.svg";currTraining
                console.log("Set default userpic");
            }else {
                tmp = data.picture;
            }
            $scope.userpics[username] = tmp;
            console.log(tmp);
            return tmp;
        })
    };

    //fetch username
    AuthService.getCurrentUser().then(function(username) {
        $scope.username = username;
    }, function(err) {
        console.log("Something went wrong!");
        console.log(err)
    });

    //get Next Training on init
    $scope.getNextTraining();
}]);