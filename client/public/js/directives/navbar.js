app.directive("navbar", ["$location", "AuthService", function($location, AuthService) {
  return {
    restrict: "E",
    scope: {
      log: "@",
    },
    replace: true,
    templateUrl: "templates/navbarTemplate.html",
    controller: function($scope) {

      $scope.name = "Team Volleyball";
      if ($scope.log === "true") {
        AuthService.getCurrentUser().then(function(username) {
            $scope.username = username;
            $scope.homeLink = "#/main";
            $scope.views = [{
              'link': "#/main",
              'text': "Hauptseite"
            }, {
              'link': "#/profile?user=" + $scope.username,
              'text': "Mein Profil",
              "symbol": "user"
            },
            {
              'link': "#/competitions",
              'text': "Turniere"
            }];
          },
          function(err) {
            console.log("Something went wrong!");
            console.log(err)
          });

      } else {
        $scope.homeLink = "#/login";
        $scope.views = [{
          'link': "#/login",
          'text': "Login",
          "symbol": "log-out"
        }, {
          'link': "#/register ",
          'text': "Registrierung"
        }];
      }

      $scope.logout = function() {

        // call logout from service
        AuthService.logout()
          .then(function() {
            $location.path('/login');
          });
      };

      $scope.changeActiveTab = function(link) {
        for (var view in $scope.views) {
          console.log($scope.views[view])
          if ($scope.views[view].link === link) {
            console.log("Active: " + link)
            $scope.views[view].active = true;
          }
          if ($scope.views[view].link !== link) {
            $scope.views[view].active = false;
          }
        }
      };
    }
  }
}])