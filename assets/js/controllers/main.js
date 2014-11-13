'use strict';

/**
 * @ngdoc function
 * @name corPingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the corPingApp
 */
angular.module('corPingApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    //Sends event to all other subscribers
    $scope.setup = {};
    getLocation();
    io.socket.get("/ping/getSocketID", function (resData, resJew){
      $scope.setup.name = resData.id;

    });


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $scope.setup.location = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    $scope.setup.location = {
          lat:position.coords.latitude,
          lng: position.coords.longitude
    };
}

angular.element('#myModal').modal('show');


  }]);
