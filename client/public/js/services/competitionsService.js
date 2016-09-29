app.factory('competitionsService',  ['$q', '$timeout', '$http',  function ($q, $timeout, $http) {
    // return available functions for use in the controllers
    return ({
      get:get,
      createOrUpdate:createOrUpdate
    });

    function get(id) {
      // create a new instance of deferred
      var deferred = $q.defer();
      var compID = id ? id : 'all'
      // send a post request to the server
      $http.post('/competition/get', {id: compID})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve(data.data);
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }

    function createOrUpdate(data) {
      // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/competition/newOrUpdate', {data: data})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve(data.data);
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
}]);
