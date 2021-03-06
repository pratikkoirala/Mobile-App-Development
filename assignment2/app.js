//this code allows us to write the ionic code
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

            getStuff: function () {

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

            },

            addObject: function (_params) {

                // for POST, we only need to set the authentication header
                var settings = {
                    headers: authenticationHeaders
                };
                // for POST, we need to specify data to add, AND convert it to
                // a string before passing it in as seperate parameter data
                var dataObject = {
                    "name": _params.name,
                    "room": _params.room,
                };

                var dataObjectString = JSON.stringify(dataObject);

                // $http returns a promise, which has a then function
                return $http.post(baseURL + 'classes/stuff', dataObjectString, settings)
                    .then(function (response) {
                        // In the response resp.data contains the result
                        // check the console to see all of the data returned
                        console.log('addObject', response);
                        return response.data;
                    });
            },
            updateObject: function (_params) {

                // for POST, we only need to set the authentication header
                var settings = {
                    headers: authenticationHeaders
                };
                // for POST, we need to specify data to add, AND convert it to
                // a string before passing it in as seperate parameter data

                var dataObject = {
                    "name": (_params.name ? _params.name : JSON.null),
                    "room": (_params.room ? _params.room : JSON.null)
                };

                var dataObjectString = JSON.stringify(dataObject);

                var apiUrl = baseURL + 'classes/stuff/' + _params.objectId;

                // $http returns a promise, which has a then function,
                // which also returns a promise
                return $http.put(apiUrl, dataObjectString, settings)
                    .then(function (response) {
                        // In the response resp.data contains the result
                        // check the console to see all of the data returned
                        console.log('updateObject', response);
                        return response.data;
                    });
            },
            deleteObjectById: function (_id) {

                var settings = {
                    headers: authenticationHeaders
                };

                // $http returns a promise, which has a then function,
                // which also returns a promise
                return $http.delete(baseURL + 'classes/stuff/' + _id, settings)
                    .then(function (response) {
                        // In the response resp.data contains the result
                        // check the console to see all of the data returned
                        console.log('deleteObjectById', response);
                        return response.data;
                    });
            }
        }
    })
    // injects ionic library to the app
    .controller('firstOne', function ($scope, ParseHttpService) {    // takes app module and builds a controller for the app, uses the ParseHttpService service.
        //This is private
        var privateVar = "i can't see this";

        //This is accessible from the view
        $scope.variable1 = "world";

        ParseHttpService.login().then(function (_response) {
            $scope.currentUser = _response;
            $scope.apiResponseData = _response;

            return ParseHttpService.getStuff();

        }).then(function (_data) {
            $scope.apiResponseData = _data.results;
        }, function error(_error) {
            console.log(_error);
        });
        $scope.inputItem = {
            value: "",
            name: "",
            room: ""
        };

        $scope.addItem = function addItem() {

            // separate the values you get from the ng-model
            // on the input field
            var data = $scope.inputItem.value.split(",");

            if (data.length === 2) {
                $scope.inputItem.name = data[0].trim();
                $scope.inputItem.room = data[1].trim();

                ParseHttpService.addObject($scope.inputItem)
                    .then(function itemSaved(_newItem) {
                        alert("Item Saved", _newItem.objectId);
                        $scope.inputItem = {};

                        return ParseHttpService.getStuff();

                    }, function errorSaving(_error) {
                        $scope.inputItem = {};
                    });
            } else {
                alert("Invalid Input: " + $scope.inputItem.value);
                $scope.inputItem = {};
            }
        };

        $scope.editObject = function editObject(_object) {

            var data = null;
            var editedObject = {};
            var objectData = prompt("Enter the Edited Information", _object.name + ", " + _object.room);

            // check if the user entered some data
            if (objectData !== null) {
                // separate the values
                data = objectData.split(",");
            }

            // check if the user entered some data and if i got two items
            // back when I split the data for name and room value
            if (objectData && (data.length === 2)) {

                // create object parameters to save
                editedObject.name = data[0].trim();
                editedObject.room = data[1].trim();
                editedObject.objectId = _object.objectId;

                console.log(JSON.stringify(editedObject));

                ParseHttpService.updateObject(editedObject)
                    .then(function itemUpdated(_updatedItem) {
                        alert("Item Updated " + _updatedItem.objectId);

                        return ParseHttpService.getStuff();

                    }, function errorSaving(_error) {
                        alert("Error Editing Object " + _error)
                    });
            } else {
                if (objectData !== null) {
                    alert("Invalid Input: " + objectData);
                }
            }
        };
        $scope.deleteObject = function editObject(_objectId) {
            ParseHttpService.deleteObjectById(_objectId)
                .then(function itemSaved(_deletedObject) {
                    alert("Item Deleted " + _deletedObject.objectId);

                    return ParseHttpService.getStuff();

                }, function errorDeleting(_error) {
                    alert("Error Deleting Object " + _objectId)
                });
        };
    }
)
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
    })
    .controller('homeCtrl', function ($scope, $state, ParseHttpService) {
        $scope.stateInfo = $state.current;

    })
    .controller('detailCtrl', function ($scope, $state, ParseHttpService) {
        $scope.stateInfo = $state.current;
        $scope.params = $state.params;
        ParseService.getObjectById($state.params.objectId).then(function(_data){
            console.log(_data);
            $scope.item = _data;
        }, function (_error) {
            alert("Error". _error.message);
        });
    })
