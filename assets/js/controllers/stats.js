'use strict';

/**
 * @ngdoc function
 * @name corPingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the corPingApp
 */
angular.module('corPingApp')
  .controller('StatsCtrl', ['$scope', 'HostFact', function ($scope, HostFact) {

    var hosts = new HostFact();
      hosts.setHost('ucsuatrac1-vip.ci.raleigh.nc.us', 'gistst1', '192.168.55.141');
      hosts.setHost('ucsuatrac2-vip.ci.raleigh.nc.us', 'gistst2', '192.168.55.143');
      hosts.setHost('ucsprdrac1-vip.ci.raleigh.nc.us', 'gisprd1', '192.168.54.221');
      hosts.setHost('ucsprdrac2-vip.ci.raleigh.nc.us', 'gisprd2', '192.168.54.223');
      hosts.setHost('gisarcweb1.ci.raleigh.nc.us', 'arcgisServer1', '192.168.54.204');
      hosts.setHost('gisarcweb2.ci.raleigh.nc.us', 'arcgisServer2', '192.168.54.205');
      hosts.setHost('cornas01.ci.raleigh.nc.us', 'corfile1', '192.168.53.15');
      hosts.setHost('cornas02.ci.raleigh.nc.us', 'corfile2', '192.168.53.17');

    //Gets Array of hosts
    $scope.hosts = hosts.getHosts();
    //Sends event to all other subscribers
    $scope.$watch('cHost',function(){
      if ($scope.cHost){
          io.socket.get("/ping/getStats", {host: $scope.cHost.host}, function (resData){
              $scope.stats = resData;
          });
      }
    });


  }]);
