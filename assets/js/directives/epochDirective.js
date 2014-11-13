'use strict';

angular.module('corPingApp')
  .directive('epochGraph', function(HostFact, $http, $interval, $timeout){
    return {
      restrict: 'E',
      transclude: false,
      scope: {
        name: '=',
        location: '='
      },
      templateUrl: 'templates/epoch-graph.html',
      link: function ($scope, element, attrs) {

        //Creates Unix timestamp for epochjs
        Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
          if(!Date.now) Date.now = function() { return new Date(); }
            Date.time = function() { return Date.now().getUnixTime(); }

        //Creating Hosts objects
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
          io.socket.get("/ping/getTime");
            io.socket.get("/ping/getSocketID", function (resData, resJew){
              console.log(resData);
              $scope.socketId = resData.id;
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

        io.socket.on('chart', function (res){
          if ($scope.cHost.host === res[0].host){
          var res = res.sort();
          var order = [];
          for (var i = 0, x = res.length; i < x; i++){
            res[i].y = parseFloat(res[i].y);
            res[i].time = parseInt(res[i].time);
            res[i].socketId === $scope.socketId && res[i].name === $scope.name ? order.unshift(res[i]) : order.push(res[i]);
          }

          for( var i = order.length; i < 4; i++){
            order.push({time: res[0].time, y: 0});
          }
          $scope.latencyChart.push(order);
        }
        });

//////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
              var t, o, b, a;
              $scope.errorCount = 0;
              $interval(function(){
                hosts.ping1($scope.cHost.host, '8081', function (pong){
                  try {
                  $scope.ping1 = pong + 'ms';
                  t = new Date().getUnixTime();
                  $scope.ping = {
                      time: t,
                      y: pong
                    };
                  //Post to socket
                  io.socket.post('/ping', {host: $scope.cHost.host, time: t, y: pong, socketId: $scope.socketId, name: $scope.name, location: $scope.location },function (data){
                      //Get result from socket that triggers event 'chart'
                      io.socket.get("/ping/getTime", {host: data.host, time: data.time});
                  });
                }
                catch (TypeError){
                  $scope.errorCount+=1;
                }


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
