app.controller('registerViewController',  ['$scope', '$location', "$timeout", 'AuthService',
  function ($scope, $location, $timeout, AuthService) {
    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.success = false;
      $scope.disabled = true;

      console.log($scope.user);
      if($scope.user.code !== "!V0lleyball!"){
        $scope.error = true;
        $scope.disabled = false;
        $scope.errorMessage = "Der Zugangscode ist falsch!";
        console.log = "hhuh"
        return;
      }
      // call register from service
      AuthService.register($scope.user)
        // handle success
        .then(function () {
          $timeout(function () {
            $location.path('/login');
          }, 2000);

          $scope.success = true;
          $scope.successMessage = "Registrierung erfolgreich! Du wirst gleich weitergeleitet."
          $scope.disabled = false;
          $scope.user = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Der Nutzername existiert bereits!";
          $scope.disabled = false;
          $scope.user = {};
        });

    };

}]);
