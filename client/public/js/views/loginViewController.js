app.controller('loginViewController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
    $scope.loginInToSite = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      console.log($scope.login.username);
      console.log($scope.login.password);

      AuthService.login($scope.login.username, $scope.login.password)
        // handle success
        .then(function () {
          $location.path('/main');
          $scope.disabled = false;
          $scope.login = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.login = {};
        });

    };

}]);
