angular.module('app', ['ionic', 'App.Controllers'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "views/home.html",
                controller: "homeCtrl"
            })
            .state('detail', {
                url: "/detail/:objectId",
                templateUrl: "views/detail.html",
                controller: "detailCtrl"
            });
    });


