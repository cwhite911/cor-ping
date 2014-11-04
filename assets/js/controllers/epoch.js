'use strict';

/**
 * @ngdoc function
 * @name corPingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the corPingApp
 */
angular.module('corPingApp')
  .controller('EpochCtrl', ['$scope', '$http', '$interval', 'HostFact', function ($scope, $http, $interval, HostFact) {
    HostFact.setHost('ucsuatrac1-vip.ci.raleigh.nc.us', 'gistst-1', '192.168.55.141');
    HostFact.setHost('ucsuatrac2-vip.ci.raleigh.nc.us', 'gistst-2', '192.168.55.142');
    HostFact.setHost('mapststarcsvr1.ci.raleigh.nc.us', 'gistst-2', '192.168.55.162');
    HostFact.setHost('mapststarcsvr2.ci.raleigh.nc.us', 'gistst-2', '192.168.55.163');
    HostFact.setHost('cornas01.ci.raleigh.nc.us', 'corfile', '192.168.53.15');
    HostFact.setHost('cornas02.ci.raleigh.nc.us', 'corfile', '192.168.53.17');

    $scope.hosts = HostFact.getHosts();
    console.log($scope.hosts);
    var startTime = new Date().getTime();
    $scope.lineChartData = [
        {
          label: 'test',
          values: [{time: startTime, y: 0 }]
        }
    ];

      if ($scope.lineChartData[0].values.length > 0){
      $scope.latencyChart = angular.element('#areaChart').epoch({
          type: 'time.line',
          data: $scope.lineChartData,
          queueSize: 300,
          ticks: {time: 5},
          axes: ['left', 'bottom']
        });
      }



    $interval(function(){
    if ($scope.hosts !== undefined){
    $http.get('/ping/getPing', {params: {ip: $scope.hosts.host }}).success(function(res){
      var t = new Date().getTime();


      var outstring = res.split('time=')[1];
      var b = outstring.split(' ms\n')[0];

            var a = parseFloat(b).toFixed(3);
            a = parseFloat(a);

      $scope.ping = {
        time: t,
         y: a
      };

      $http.post('/ping', {host: $scope.hosts.host, time: t, y: a }).then(function(){
        $http.get('/ping', {host: $scope.hosts.host}).then(function(res3){
          console.log(res3);
        });
      });

      // $scope.lineChartData[0].values = [$scope.ping];
      $scope.latencyChart.push([$scope.ping]);
      // console.log($scope.latencyChart);
    });
  }
  else {
    host = host;
  }
  }, 500);

  }]);
