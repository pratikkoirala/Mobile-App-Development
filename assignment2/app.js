angular.module('app', ['ionic'])   
.service('ParseHttpService', function ($http) {
        var baseURL = "https://api.parse.com/1/";
        var authenticationHeaders = {
            "x-parse-application-id": "vX6BsOG1S6MeKiOroleWYaugkH1qx73Ghb08d4Tm",
            "x-parse-rest-api-key": "qiSmxqEvpkHKdG9KTQtaYJKoGbEmB3auKP3iYW9h"
    };

        return {

            login: function () {

                var credentials = {
                    "username": "admin",
                    "password": "test"
                };

                var settings = {
                    method: 'GET',
                    url: baseURL + 'login',
                    headers: authenticationHeaders,
                    // params are for query string parameters
                    params: credentials
                };

                // $http returns a promise, which has a then function,
                // which also returns a promise
                return $http(settings)
                    .then(function (response) {
                        // In the response resp.data contains the result
                        // check the console to see all of the data returned
                        console.log('login', response);
                        return response.data;
                    });
            },

            getStuffs: function () {

                // if an id is passed in then use it when querying
                // stuff data
                var settings = {
                    method: 'GET',
                    url: baseURL + 'classes/stuff/',
                    headers: authenticationHeaders
                };

                // $http returns a promise, which has a then function,
                // which also returns a promise
                return $http(settings)
                    .then(function (response) {
                        // In the response resp.data contains the result
                        // check the console to see all of the data returned
                        console.log('getStuff', response);
                        return response.data;
                    });

            }
        }
  // injects ionic library to the app
.controller('firstOne', function($scope, ParseHttpService){    // takes app module and builds a controller for the app
	//This is private
	var privateVar = "i can't see this";
	
	//This is accessible from the view
	$scope.variable1 = "world";

    $scope.apiResponseData = {};
        
    ParseHttpService.getStuffs().then(function (_data) {
        $scope.apiResponseData = _data;
            });


        

    })


});
