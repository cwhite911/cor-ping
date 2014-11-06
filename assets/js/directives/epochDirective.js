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
            },
            {
              label: 'test1',
              values: [{time: new Date().getTime(), y: 0 }]
            }
          ];




$scope.y = [];

io.socket.get("/ping", function(resData, jwres){
  console.log('listening for ping...');
});





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
//////////////////////////////////////////////////////////////////
///////Socket Logic /////////////////////////////////////////////
if (!io.socket.alreadyListeningToOrders) {
io.socket.alreadyListeningToOrders = true;
io.socket.on('ping', function onServerSentEvent (msg) {
console.log(msg);
// Let's see what the server has to say...
switch(msg.verb) {

  case 'created':
    if ($scope.cHost.host === msg.data.host){
      msg.data.sid = msg.id;
      $scope.message = msg.data.y;
    //  $scope.latencyChart.push([{time: msg.data.time, y: msg.data.y}, {time: msg.data.time, y: $scope.ping.y}]); // (add the new order to the DOM)
      $scope.$apply();              // (re-render)
      break;
    }


  default: return; // ignore any unrecognized messages
}
});
}


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
              var t, o, b, a;
              $scope.errorCount = 0;
              $interval(function(){
                // hosts.ping1($scope.cHost.host, '8081', function (pong){
                //   $scope.ping1 = pong + 'ms';
                //   io.socket.post('/ping', {host: $scope.cHost.host, time: new Date().getTime(), y: pong});
                // });
                // console.log(hosts.ping($scope.cHost.host));
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

                  io.socket.post('/ping', {host: $scope.cHost.host, time: t, y: a }, function(data){
                          // $scope.latencyChart.push([$scope.ping]);

                  });

                  $scope.latencyChart.push([{time: t, y: $scope.message || 0 }, $scope.ping]);


                  // $scope.latencyChart.push([$scope.ping]);
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
