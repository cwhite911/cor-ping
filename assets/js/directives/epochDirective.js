'use strict';

angular.module('corPingApp')
  .directive('epochGraph', function(HostFact, $http, $interval, $timeout){
    return {
      restrict: 'E',
      transclude: false,
      scope: {},
      templateUrl: 'templates/epoch-graph.html',
      link: function ($scope, element, attrs) {
          var hosts = new HostFact();
            hosts.setHost('ucsuatrac1-vip.ci.raleigh.nc.us', 'gistst1', '192.168.55.141');
            hosts.setHost('ucsuatrac2-vip.ci.raleigh.nc.us', 'gistst2', '192.168.55.142');
            hosts.setHost('mapststarcsvr1.ci.raleigh.nc.us', 'gistst3', '192.168.55.162');
            hosts.setHost('mapststarcsvr2.ci.raleigh.nc.us', 'gistst4', '192.168.55.163');
            hosts.setHost('cornas01.ci.raleigh.nc.us', 'corfile1', '192.168.53.15');
            hosts.setHost('cornas02.ci.raleigh.nc.us', 'corfile2', '192.168.53.17');

          $scope.hosts = hosts.getHosts();
          var lineChartData = [
            {
              label: 'test',
              values: [{time: new Date().getTime(), y: 0 }]
            }
          ];

        $timeout(function(){
            $scope.$watch('cHost',function(){
              if ($scope.cHost){
                var eleId = '#' + $scope.cHost.alias;
                $scope.latencyChart = angular.element(eleId).epoch({
                  type: 'time.line',
                  data: lineChartData,
                  queueSize: 300,
                  ticks: {time: 25},
                  axes: ['left', 'bottom', 'right']
                });

              var t, o, b, a;
              $scope.errorCount = 0;
              $interval(function(){

                $http.get('/ping/getPing', {params: {ip: $scope.cHost.host }}).success(function(res){
                   t = new Date().getTime();
                   try {
                     o = res.split('time=')[1];
                     b = o.split(' ms\n')[0];
                     a = parseFloat(b).toFixed(3);
                     a = parseFloat(a);
                   }
                   catch (TypeError){
                     $scope.errorCount+=1
                   }
                  $scope.ping = {
                    time: t,
                    y: a
                  };

                  $http.post('/ping', {host: $scope.cHost.host, time: t, y: a }).then(function(data){
                    $http.get('/ping', {host:$scope.cHost.host}).then(function(res3){

                    });
                  });


                  $scope.latencyChart.push([$scope.ping]);
                });

              }, 500);
            }
            else {
              $scope.message = "Please select a host";
            }
          });
        }, 500);
      }
    }
  });
