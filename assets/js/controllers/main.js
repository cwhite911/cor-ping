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
      io.socket.on("ping", function(event){
        console.log(event);
      });

      io.socket.get("/ping", function(resData, jwres){
        console.log(jwres);
        console.log('listening for ping...');
      });

  }]);
