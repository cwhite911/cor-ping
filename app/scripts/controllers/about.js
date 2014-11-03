'use strict';

/**
 * @ngdoc function
 * @name corPingApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the corPingApp
 */
angular.module('corPingApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
