app.controller('competitionsViewController', ['$scope', 'AuthService', 'competitionsService', "$uibModal", function($scope, AuthService, competitionsService, $uibModal) {
    //VARS
    $scope.comps = [];
    $scope.newCompetition = {};
    $scope.openDatePicker = false;
    $scope.createNewCompetition = false;
    $scope.datepicker = {opened:false};
    $scope.currentCompetition = {};
    $scope.editComp = false;

    //FUNCTIONS
    $scope.getAllCompetitions = function() {
        competitionsService.get().then(function(comps) {
                $scope.comps = comps || [];
                if ($scope.comps.length === 0) {
                    $scope.createNewCompetition = true;
                }else{
                    $scope.currentCompetition = $scope.comps[$scope.comps.length-1];
                }
                console.log($scope.comps);
                console.log($scope.createNewCompetition);
            },
            function(err) {
                console.log("Something went wrong!");
                console.log(err)
            });
    };

    $scope.showCompetition = function(id) {
        $scope.currentCompetition = $scope.comps[id];
        console.log($scope.currentCompetition);
        $scope.createNewCompetition = false;
    };

    $scope.openDatePicker = function() {
        console.log("Open Picker");
        $scope.datepicker.opened = true;
    };

    $scope.showNewCompView = function () {
        $scope.createNewCompetition = true;
    };

    $scope.createCompetition = function() {
        //pass unique id to ident each comp
        $scope.newCompetition.id = $scope.comps.length;
        $scope.newCompetition.done = false;
        console.log($scope.newCompetition);
        competitionsService.createOrUpdate($scope.newCompetition).then(function() {
            console.log("Done");
            $scope.getAllCompetitions();
        })
    };

    $scope.saveCompetition = function () {
        competitionsService.createOrUpdate($scope.currentCompetition).then(function (status) {
            if(status === "OK"){
                console.log("Updated successfull");
            }
        })
    };

    $scope.editCompetition = function() {
        $scope.editComp = true;
    };

    $scope.writeReport = function() {

    };

    //START
    //initially fetch all competitions
    $scope.getAllCompetitions();
}]);
