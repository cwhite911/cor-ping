'use strict';

/**
 * @ngdoc function
 * @name corPingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the corPingApp
 */
angular.module('corPingApp')
  .controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.hosts = ['192.168.54.205', '10.6.4.20'];
    var startTime = new Date().getTime();
    $scope.lineChartData = [
        {
          label: 'test',
          values: [{time: startTime, y: 0 }]
        }
    ];
    // $scope.latencyChart = angular.element('#areaChart').epoch({
    //   type: 'time.area',
    //   data: $scope.lineChartData
    // });
    // $scope.$watch('lineChartData', function() {
      if ($scope.lineChartData[0].values.length > 0){
      $scope.latencyChart = angular.element('#areaChart').epoch({
          type: 'time.line',
          data: $scope.lineChartData,
          queueSize: 300,
          ticks: {time: 5},
          axes: ['left', 'bottom']
        });
      }
    // });


    $interval(function(){
    if ($scope.host !== undefined){
    $http.get('http://localhost:1337/ping/getPing', {params: {ip: $scope.host }}).success(function(res){
      var t = new Date().getTime();
      // console.log(res);

      var outstring = res.split('time=')[1];
			var b = outstring.split(' ms\n')[0];

						var a = parseFloat(b).toFixed(3);
            a = parseFloat(a);

      $scope.ping = {
        time: startTime + 2000,
         y: a
      };

      $http.post('http://localhost:1337/ping', {host: $scope.host, time: t, y: a }).then(function(){
        $http.get('http://localhost:1337/ping', {host: $scope.host}).then(function(res3){
          console.log(res3);
        });
      });

      // $scope.lineChartData[0].values = [$scope.ping];
      $scope.latencyChart.push([$scope.ping]);
      // console.log($scope.latencyChart);
    });
  }
  else {
    $scope.host = $scope.host;
  }
  }, 500);

  }]);
