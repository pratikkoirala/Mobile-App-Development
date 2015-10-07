angular.module('App.Controllers', ['App.Services'])
    .controller('homeCtrl', function ($scope, ParseHttpService, $state) {
        $scope.stateInfo = $state.current;
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
                    .                   then(function itemUpdated(_updatedItem) {
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
    })
    .controller('detailCtrl', function ($scope, $state, ParseHttpService) {
        $scope.stateInfo = $state.current;
        $scope.params = $state.params;
        ParseHttpService.getObjectById($state.params.objectId).then(function (_data) {
            console.log(_data);
            $scope.item = _data;
        }, function (_error) {
            alert("Error"._error.message);
        });
    });
