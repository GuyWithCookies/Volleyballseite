app.controller('competitionsViewController', ['$scope', 'AuthService', 'competitionsService', "$uibModal", function($scope, AuthService, competitionsService, $uibModal) {
  //VARS
  $scope.comps = [];
  $scope.newCompetition = {};
  $scope.openDatePicker = false;
  $scope.createNewCompetition = false;
  $scope.datepicker = {opened:false};

  //FUNCTIONS
  $scope.getAllCompetitions = function() {
    competitionsService.get().then(function(comps) {
      $scope.comps = comps || [];
      if ($scope.comps.length === 0) {
        $scope.createNewCompetition = true;
      }
      console.log($scope.comps);
      console.log($scope.createNewCompetition);
    },
    function(err) {
      console.log("Something went wrong!")
      console.log(err)
    });
  }

  $scope.getCompetition = function(id) {

  }

  $scope.openDatePicker = function() {
    console.log("Open Picker");
    $scope.datepicker.opened = true;
  };
  
  $scope.createCompetition = function() {
    //pass unique id to ident each comp
    $scope.newCompetition.id = $scope.comps.length;
    $scope.newCompetition.done = false;
    console.log($scope.newCompetition);
    competitionsService.new($scope.newCompetition).then(function() {
      console.log("Done");
      $scope.getAllCompetitions();
    })
  }

  $scope.editCompetition = function() {

  }

  $scope.writeReport = function() {

  }

  //START
  //initially fetch all competitions
  $scope.getAllCompetitions();
}]);
