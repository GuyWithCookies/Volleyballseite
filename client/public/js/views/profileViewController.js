app.controller('profileViewController', ['$scope', '$location', 'AuthService', 'TrainingService', function($scope, $location, AuthService, TrainingService) {
    $scope.user = ($location.url()).split("=")[1];
    $scope.editing = false;

    $scope.toggleEditing = function() {
        $scope.editing = !$scope.editing;
        console.log($scope.editing);
    };

    $scope.save = function() {
        AuthService.saveUserData($scope.userdata).then(function(status) {
                $scope.editing = false;
                console.log($scope.editing);
                $scope.getUserData($scope.user);
            },
            function(err) {
                console.log("Something went wrong!");
                console.log(err)
            }
        );
    };

    $scope.getUserData = function(user) {
        AuthService.getUserData(user).then(function(userData) {
                $scope.userdata = userData;
                console.log(userData);
                if ($scope.userdata.picture === undefined) {
                    $scope.userdata.picture = "defaultUser.svg"
                }
                console.log($scope.userdata)
            },
            function(err) {
                console.log("Something went wrong!");
                console.log(err)
            }
        );
    };

    AuthService.getCurrentUser().then(function(username) {
            $scope.currentUser = username;
        },
        function(err) {
            console.log("Something went wrong!");
            console.log(err)
        }
    );

    $scope.getUserData($scope.user);
}]);