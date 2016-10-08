var app = angular.module('app', ['ngRoute', "ui.bootstrap", "flow"]);

app.config(["$routeProvider", "$logProvider", function ($routeProvider, $logProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../templates/publicTemplate.html',
            controller: 'publicViewController',
            access: {restricted: false}
        })
        .when('/login', {
            templateUrl: '../templates/loginView.html',
            controller: 'loginViewController',
            access: {restricted: false}
        })
        .when('/logout', {
            controller: 'logoutController',
            access: {restricted: true}
        })
        .when('/register', {
            templateUrl: '../templates/registerView.html',
            controller: 'registerViewController',
            access: {restricted: false}
        })
        .when('/main', {
            templateUrl: '../templates/mainView.html',
            controller: 'mainViewController',
            access: {restricted: true}
        })
        .when('/profile', {
            templateUrl: '../templates/profileView.html',
            controller: 'profileViewController',
            access: {restricted: true}
        })
        .when('/competitions', {
            templateUrl: '../templates/competitionsView.html',
            controller: 'competitionsViewController',
            access: {restricted: true}
        })
        .otherwise({
            redirectTo: '/'
        });

    $logProvider.debugEnabled(true);
}]);

app.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            AuthService.getUserStatus()
                .then(function(){
                    next.access = next.access || {};    
                    if (next.access.restricted && !AuthService.isLoggedIn()){
                        $location.path('/login');
                        $route.reload();
                    }
                });
        });
});
