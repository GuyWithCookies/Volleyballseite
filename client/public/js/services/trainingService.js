app.factory('TrainingService',  ['$q', '$timeout', '$http',  function ($q, $timeout, $http) {
    // return available functions for use in the controllers
    return ({
      get:get,
      register: register,
      newComment: newComment
    });

    function get(date) {
      // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/training/get', {date: date})
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

    //status --> appear, maybe, not
    //food, drink --> Boolean
    function register(username, data) {
      console.log(username)
      console.log(data)
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/training/register',
        {username: username, date:data.date, status: data.status, food:data.food, drink:data.drink})
        // handle success
        .success(function (data, status) {
          console.log(data);
          console.log(status);
          if(status === 200 && data.status === "OK"){
            console.log("got success back");
            deferred.resolve(data);
          } else {
            deferred.reject(data.message);
          }
        })
        // handle error
        .error(function (data) {
          console.log(data)
          deferred.reject(data);
        });

      // return promise object
      return deferred.promise;

    }

    function newComment(username, data) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/training/newComment',
        {username: username, "message": data.message, trainingDate: data.trainingDate, "createDate":data.createDate})
        // handle success
        .success(function (data, status) {
          console.log(data);
          console.log(status);
          if(status === 200 && data.status === "OK"){
            console.log("got success back");
            deferred.resolve(data);
          } else {
            deferred.reject(data.message);
          }
        })
        // handle error
        .error(function (data) {
          console.log(data);
          deferred.reject(data);
        });

      // return promise object
      return deferred.promise;

    }

}]);
