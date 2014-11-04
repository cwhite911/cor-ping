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
      // var socket = io.socket.get('/ping');
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position){
            return {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
          });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }


      var location = getLocation();
      io.socket.on('welcome', function (data) {
          console.log(data);
      });

      io.socket.post('/ping/location', location);

  }]);
