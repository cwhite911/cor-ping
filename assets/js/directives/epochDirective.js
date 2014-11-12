'use strict';

angular.module('corPingApp')
  .directive('epochGraph', function(HostFact, $http, $interval, $timeout){
    return {
      restrict: 'E',
      transclude: false,
      scope: {},
      templateUrl: 'templates/epoch-graph.html',
      link: function ($scope, element, attrs) {

        //Creates Unix timestamp for epochjs
        Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
          if(!Date.now) Date.now = function() { return new Date(); }
            Date.time = function() { return Date.now().getUnixTime(); }

        //Creating Hosts objects
          var hosts = new HostFact();
            hosts.setHost('ucsuatrac1-vip.ci.raleigh.nc.us', 'gistst1', '192.168.55.141');
            hosts.setHost('ucsuatrac2-vip.ci.raleigh.nc.us', 'gistst2', '192.168.55.142');
            hosts.setHost('mapststarcsvr1.ci.raleigh.nc.us', 'gistst3', '192.168.55.162');
            hosts.setHost('mapststarcsvr2.ci.raleigh.nc.us', 'gistst4', '192.168.55.163');
            hosts.setHost('cornas01.ci.raleigh.nc.us', 'corfile1', '192.168.53.15');
            hosts.setHost('cornas02.ci.raleigh.nc.us', 'corfile2', '192.168.53.17');

          //Gets Array of hosts
          $scope.hosts = hosts.getHosts();

          //Default Chart data
          var lineChartData = [
            {
              label: 'default',
              values: [{time: new Date().getUnixTime(), y: 0 }]
            },
            {
              label: 'default1',
              values: [{time: new Date().getUnixTime(), y: 0 }]
            },
            {
              label: 'default2',
              values: [{time: new Date().getUnixTime(), y: 0 }]
            },
            {
              label: 'default3',
              values: [{time: new Date().getUnixTime(), y: 0 }]
            },

          ];




          //Starts listening get socket info
          $scope.classNames = [];
          $scope.activeSockets = [];
          io.socket.get("/ping");
            io.socket.get("/ping/getSocketID", function (resData, resJew){
              console.log(resData);
              $scope.socketId = resData.id + 2;
            });




        $timeout(function(){
            $scope.$watch('cHost',function(){
              if ($scope.cHost){
                var eleId = '#' + $scope.cHost.alias;
                $scope.latencyChart = angular.element(eleId).epoch({
                  type: 'time.area',
                  data: lineChartData,
                  queueSize: 300,
                  ticks: {time: 25},
                  axes: ['left', 'bottom', 'right']
                });
                angular.element(eleId).addClass('default area');
                console.log(angular.element(eleId));
                io.socket.get("/ping/getStats", {host: $scope.cHost.host}, function (resData){
                    $scope.stats = resData;
                });
//////////////////////////////////////////////////////////////////
///////Socket Logic /////////////////////////////////////////////

          io.socket.on('ping', function onServerSentEvent (msg) {

          // Let's see what the server has to say...
            switch(msg.verb) {

            case 'created':
              if ($scope.cHost.host === msg.data.host && msg.data.socketId !== $scope.socketId){
                //Creates Class names
                var classCount = 1;
                var className = 'default' + classCount;
                $scope.activeSockets.length === 0 ? $scope.activeSockets.push({id: msg.data.socketId, class: className}) : $scope.activeSockets;
                //Checks if socket is active
              $scope.activeSockets.forEach(function(soc){
                  if (soc.id === msg.data.socketId){
                    $scope.className = soc.class;
                  }
                  else{
                    $scope.activeSockets >= 1 ? $scope.activeSockets.push({id: msg.data.socketId, class: className}) : $scope.activeSockets;
                    classCount++;
                    $scope.className = soc.class;


                  }
                });

                $scope.message = msg.data.y;
                $scope.$apply();
              }      // (re-render)
                break;



            default: return; // ignore any unrecognized messages
          }
          });



/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
              var t, o, b, a;
              $scope.errorCount = 0;
              $interval(function(){
                hosts.ping1($scope.cHost.host, '8081', function (pong){
                  try {
                  $scope.ping1 = pong + 'ms';
                  var d = new Date();
                  t = d.getUnixTime();
                  $scope.ping = {
                      time: t,
                      y: pong
                    };
                  io.socket.post('/ping', {host: $scope.cHost.host, time: t, y: pong, socketId: $scope.socketId });
                }
                catch (TypeError){
                  $scope.errorCount+=1;
                }
                });
                // console.log(hosts.ping($scope.cHost.host));
                // $http.get('/ping/getPing', {params: {ip: $scope.cHost.host }}).success(function(res){
                //    var d = new Date();
                //    t = d.getUnixTime();
                //    $scope.time = t;
                //    $scope.date1 = d;
                //    $scope.date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
                //    try {
                //      o = res.split('time=')[1];
                //      b = o.split(' ms\n')[0];
                //      a = parseFloat(b).toFixed(3);
                //      a = parseFloat(a);
                //    }
                //    catch (TypeError){
                //      $scope.errorCount+=1
                //    }
                //   $scope.ping = {
                //     time: t,
                //     y: a
                //   };
                //
                //   io.socket.post('/ping', {host: $scope.cHost.host, time: t, y: a, socketId: $scope.socketId }, function(data){
                //           // $scope.latencyChart.push([$scope.ping]);
                //   });


                  //Prepares data to be sent to chart by checking for a valid message from socket
                  var sendData = [$scope.ping, {time: t, y: 0}, {time: t, y: 0}, {time: t, y: 0}];
                  if (typeof $scope.message === 'number' && $scope.message !== NaN){
                  if ($scope.activeSockets.length > 0){
                    switch ($scope.className){
                      case "default1":
                        sendData.splice(1,0, {time: t, y: $scope.message});
                        break;
                      case "default2":
                        sendData.splice(2,0, {time: t, y: $scope.message});
                        break;
                      case "default3":
                        sendData.splice(3,0, {time: t, y: $scope.message});
                        break;
                    }
                  }

                  }
                  $scope.latencyChart.push(sendData);


                  // $scope.latencyChart.push([$scope.ping, {time: t, y: 0}, {time: t, y: 0}, {time: t, y: 0}]);
                // });

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
