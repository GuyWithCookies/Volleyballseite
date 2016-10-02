/**
 * Created by cookieguy on 02.10.16.
 */
app.controller('publicViewController', ['$scope', '$http', function($scope, $http) {
        $scope.reports = [];

        $http.get('/competition/getReports')
        // handle success
            .success(function (data, status) {
                if(status === 200 && data.status){
                    $scope.reports = data.data;
                    console.log($scope.reports);
                } else {
                    console.log("Error");
                }
            })
            // handle error
            .error(function (data) {
                console.log("Error");
            });
}]);