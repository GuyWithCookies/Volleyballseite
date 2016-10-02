app.controller('mainViewController', ['$scope', 'AuthService', 'TrainingService', function($scope, AuthService, TrainingService) {


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
    date = date.next().monday();
    if (setDate) {
      date = setDate;
    }
    var timestamp = new Date(date).getTime();
    TrainingService.get(timestamp.toString()).then(function(res) {
      $scope.currTraining = res;
      console.log($scope.currTraining.date);

    });
  }

  $scope.getPrevTraining = function() {
    var date = $scope.currTraining.date || Date.today().add(2).hours();
    console.log($scope.currTraining.date);
    date = Date.parse(date);
    date = date.last().monday();
    var timestamp = new Date(date).getTime();
    TrainingService.get(timestamp.toString()).then(function(res) {
      $scope.currTraining = res;
    });
  }

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
        console.log("Something went wrong!")
        console.log(err)
      })
    }, function(err) {
      console.log("Something went wrong!")
      console.log(err)
    });
  }

  $scope.newComment = function() {
    if ($scope.message === undefined || $scope.message === "") {
      return;
    }
    if ($scope.username === undefined) {
      AuthService.getCurrentUser().then(function(username) {
        $scope.username = username;
      }, function(err) {
        console.log("Something went wrong!")
        console.log(err)
      });
    }

    var newCommentData = {
      message: $scope.message,
      createDate: Date.now(),
      trainingDate: $scope.currTraining.date
    };

    console.log(newCommentData);

    TrainingService.newComment($scope.username, newCommentData).then(function(res) {
      //refresh Training when success
      console.log(res)
      if (res.status === "OK") {
        console.log("OK")
        $scope.message = "";
        $scope.getNextTraining($scope.currTraining.date);
      }
    }, function(err) {
      console.log("Something went wrong!")
      console.log(err)
    })
  }

  $scope.getMessageClass = function(username) {
    if (username === $scope.username) {
      return "right";
    }else if ($scope.username === undefined) {
      return "";
    } 
    else {
      return "left";
    }
  }

  //get Next Training on init
  $scope.getNextTraining();
}]);