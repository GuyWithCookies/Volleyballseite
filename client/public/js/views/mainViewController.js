app.controller('mainViewController', ['$scope', 'AuthService', 'TrainingService', "$uibModal",
    function($scope, AuthService, TrainingService, $uibModal) {
        $scope.userpics = {};
        $scope.model = {};
        $scope.loadingComment = false;
        $scope.loadingRegister = false;

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
            if($scope.currTraining.date){
                date = $scope.currTraining.date;
                date = Date.parse(date);
                date = date.next().monday();
            }else {
                date = Date.today().add(2).hours();
                date = Date.parse(date);
                if (!date.is().monday()) {
                    console.log("Today is not monday");
                    date = date.next().monday();
                }
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
            $scope.loadingRegister = true;

            if (status === "not") {
                $scope.registerData.food = false;
                $scope.registerData.drink = false;
            }

            //fetch username
            AuthService.getCurrentUser().then(function(username) {
                TrainingService.register(username, $scope.registerData).then(function(res) {
                    //refresh Training when success
                    $scope.currTraining = res.data;
                    $scope.loadingRegister = false;
                }, function(err) {
                    console.log("Something went wrong!");
                    console.log(err);
                    $scope.loadingRegister = false;
                })
            }, function(err) {
                console.log("Something went wrong!");
                console.log(err);
                $scope.loadingRegister = false;
            });
        };

        $scope.newComment = function() {
            if ($scope.model.message === undefined || $scope.model.message === "") {
                return;
            }
            $scope.loadingComment = true;

            if ($scope.username === undefined) {
                AuthService.getCurrentUser().then(function(username) {
                    $scope.username = username;
                }, function(err) {
                    console.log("Something went wrong!");
                    console.log(err)
                });
            }

            var newCommentData = {
                message: $scope.model.message,
                createDate: Date.now(),
                trainingDate: $scope.currTraining.date
            };

            TrainingService.newComment($scope.username, newCommentData).then(function(res) {
                //refresh Training when success
                console.log(res);
                if (res.status === "OK") {
                    console.log("OK");
                    $scope.model.message = "";
                    $scope.getNextTraining($scope.currTraining.date);
                }
                $scope.loadingComment = false;

            }, function(err) {
                console.log("Something went wrong!");
                console.log(err);
                $scope.loadingComment = false;

            })
        };

        $scope.openKnowingModal = function () {
            console.log("in not selected user");
            AuthService.getAllUsers().then(function (res) {
                //add Users to list if success
                console.log(res);
                $scope.userList = res;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'userListModal.html',
                    controller: 'UserModalInstanceCtrl',
                    controllerAs: '$ct',
                    size: "lg",
                    resolve: {
                        userList: function(){
                            var tmp = [];
                            var tr = $scope.currTraining;
                            console.log(tr);
                            for(var user in $scope.userList){
                                console.log($scope.userList[user]);
                                if($scope.userList.hasOwnProperty(user)) {
                                    if (tr.appear.indexOf($scope.userList[user])===-1 &&
                                        tr.maybe.indexOf($scope.userList[user])===-1 &&
                                        tr.not.indexOf($scope.userList[user])===-1) {

                                        tmp.push($scope.userList[user]);
                                    }
                                }
                            }
                            return tmp;
                        }
                    }
                });

                modalInstance.result.then(function (selectedUsers) {
                    var callsRemaining = Object.keys(selectedUsers).length-1;
                    console.log(selectedUsers);
                    for(var username in selectedUsers){
                        if(selectedUsers.hasOwnProperty(username)) {
                            var registerData = {};
                            registerData["date"] = $scope.currTraining.date;
                            registerData["status"] = selectedUsers[username];
                            $scope.loadingRegister = true;

                            //fetch username
                            TrainingService.register(username, registerData).then(function (res) {
                                //refresh Training when success
                                if(callsRemaining <= 0) {
                                    $scope.currTraining = res.data;
                                    $scope.loadingRegister = false;
                                }else{
                                    console.log("new rec"+callsRemaining);
                                    callsRemaining--;
                                }
                            }, function (err) {
                                console.log("Something went wrong!");
                                console.log(err);
                                $scope.loadingRegister = false;
                            })
                        }
                    }
                });

            }, function(err) {
                console.log("Something went wrong!");
                console.log(err);

            })
        };

        $scope.getUserPic = function (username) {
            AuthService.getUserData(username).then(function (data) {
                console.log(data);
                if(!data.picture || data.picture === ""){
                    tmp = "defaultUser.svg";
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

//controller for the userlist modal
app.controller('UserModalInstanceCtrl', function ($uibModalInstance, userList) {
    var $ct = this;

    $ct.userList = userList;
    $ct.selectedUserList = {};

    $ct.selectUser = function (user, status) {
        if(status === '' && $ct.selectedUserList.hasOwnProperty(user)){
            console.log(user);
            console.log(status);
            delete $ct.selectedUserList[user];
            if(user.indexOf("(Gast)")>-1){
                console.log($ct.userList);
                $ct.userList.splice($ct.userList.indexOf(user), 1);
                console.log($ct.userList);
            }
            return;
        }
        $ct.selectedUserList[user] = status;
    };

    $ct.selectGuestUser = function (user, status) {
        if(user === undefined){
            return;
        }
        user = user+" (Gast)";
        $ct.userList.unshift(user);
        $ct.selectedUserList[user] = status;
        $ct.guestUser = "";
    };

    $ct.isSelected = function (user) {
        for(var u in $ct.selectedUserList){
            if(user === u){
                if($ct.selectedUserList[u] === "appear") {
                    return "alert alert-success";
                }else if($ct.selectedUserList[u] === "maybe") {
                    return "alert alert-warning";
                }else if($ct.selectedUserList[u] === "not") {
                    return "alert alert-danger";
                }
            }
        }
        return "";
    };

    $ct.ok = function () {
        $uibModalInstance.close($ct.selectedUserList);
    };

    $ct.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});