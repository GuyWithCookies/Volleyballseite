app.controller('competitionsViewController', ['$scope', '$filter', 'AuthService', 'competitionsService', "$uibModal",
    function($scope, $filter, AuthService, competitionsService, $uibModal) {
        $ctrl = this;
        //VARS
        $scope.comps = [];
        $scope.newCompetition = {};
        $scope.openDatePicker = false;
        $scope.createNewCompetition = false;
        $scope.datepicker = {opened:false};
        $scope.currentCompetition = {};
        $scope.editComp = false;
        $scope.reportMode = false;
        $scope.dateFormat = "dd.MM.yyyy";

        //FUNCTIONS
        $scope.getAllCompetitions = function() {
            competitionsService.get().then(function(comps) {
                    $scope.comps = comps || [];
                    console.log($scope.comps.length);
                    if ($scope.comps.length === 0) {
                        $scope.createNewCompetition = true;
                    }else{
                        $scope.createNewCompetition = false;
                        $scope.currentCompetition = $scope.comps[$scope.comps.length-1];
                        $scope.currentCompetition.date = new Date($scope.currentCompetition.date);
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
            for(var comp in $scope.comps){
                if($scope.comps.hasOwnProperty(comp) && $scope.comps[comp].id === id){
                    $scope.currentCompetition = $scope.comps[comp];
                }
            }
            $scope.currentCompetition.date = new Date($scope.currentCompetition.date);
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
            console.log($scope.currentCompetition);
            competitionsService.createOrUpdate($scope.currentCompetition).then(function (status) {
                console.log("Updated successfull");
                $scope.editComp = false;
            })
        };

        $scope.editCompetition = function() {
            $scope.editComp = true;
        };

        $scope.addMember = function () {
            AuthService.getCurrentUser().then(function(username) {
                    $scope.username = username;
                    console.log($scope.username);
                    if(!$scope.currentCompetition.hasOwnProperty("members")){
                        $scope.currentCompetition.members = [];
                    }
                    $scope.currentCompetition.members.push($scope.username);
                    $scope.saveCompetition();
                },
                function(err) {
                    console.log("Something went wrong!");
                    console.log(err)
                });
        };

        $scope.removeMember = function () {
            AuthService.getCurrentUser().then(function(username) {
                    $scope.username = username;
                    console.log($scope.username);
                    $scope.currentCompetition.members.splice($scope.currentCompetition.members.indexOf($scope.username));
                    console.log($scope.currentCompetition);
                    $scope.saveCompetition();
                },
                function(err) {
                    console.log("Something went wrong!");
                    console.log(err)
                });
        };

        $scope.alreadyIn = function () {
            if($scope.username){
                if($scope.currentCompetition.members.indexOf($scope.username)>-1){
                    return true;
                }else {
                    return false;
                }
            }
        };

        $scope.writeReport = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'report.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: "lg",
                resolve: {
                    competition: $scope.currentCompetition
                }
            });

            modalInstance.result.then(function (report) {
                $scope.currentCompetition.report = [report.heading, report.content];
                $scope.currentCompetition.done = true;

                console.log($scope.currentCompetition);
                $scope.saveCompetition();
            });
        };




        //START
        //initially fetch all competitions
        AuthService.getCurrentUser().then(function(username) {
                $scope.username = username;
                console.log("Fetched Username: "+$scope.username);
            },
            function(err) {
                console.log("Something went wrong!");
                console.log(err)
            }
        );

        $scope.getAllCompetitions();
    }]);


app.controller('ModalInstanceCtrl', function ($uibModalInstance, $filter, competition) {
    var $ctrl = this;

    var templates = [
        "Am DATE ging es für uns nach PLACE. Mit dabei waren MEMBERS. Nach einem klasse Spieltag erreichten wir am Ende verdient den X.Platz"
    ];

    $ctrl.report = {};

    $ctrl.competition = competition;

    var removePattern = function (str) {
        var t = $ctrl.competition;
        var s = str.replace(/NAME/g, t.name).replace(/DATE/g, $filter('date')(t.date, "dd.MM.yyyy"))
            .replace(/PLACE/g, t.place).replace(/MEMBERS/g, t.members.toString());

        return s;
    };

    $ctrl.useTemplate = function () {
        $ctrl.report.heading = removePattern("NAME - am DATE in PLACE");
        $ctrl.report.content = removePattern(templates[Math.floor(Math.random() * (templates.length))]);
    };

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.report);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});