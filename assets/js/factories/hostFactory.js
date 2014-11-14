'use strict';

angular.module('corPingApp')
  .factory('HostFact', function(){
    var hosts = [],
        start = 0.000,
        end = 0.000;
    var Hosts = function (){
      this.setHost = function (name, alias, host) {
        // for (var i = 0, x = hosts.length; i < x; i++){
          // hosts[i].host !== host ? hosts.push({name: name, alias: alias, host: host}) : hosts ;
          hosts.push({name: name, alias: alias, host: host});
        // }
      },
      this.getHosts = function (){
        return hosts;
      },
      this.ping = function (host){
            var temp = 'http://' + host; //+ '/na_admin';
            start = new Date().getTime();
            angular.element('#junkOne').attr('src', temp).error(function (err) {
              var end = new Date().getTime(),
                  total = (end - start);
              console.log(total);
              total1 = parseFloat(total);
              console.log(typeof total1);
              return total1.toFixed(3);
            });
      },
      this.ping1 = function (host, port, pong) {

        var http = new XMLHttpRequest(),
            started = new Date().getTime();

        http.open("GET", "http://" + host + ":" + port, /*async*/true);
        http.onreadystatechange = function() {
          if (http.readyState == 4) {
            var ended = new Date().getTime();

            var milliseconds = ended - started;

          if (pong != null) {
            pong(milliseconds);
          }
        }
      };
      try {
        http.send(null);
      } catch(exception) {
        // this is expected
      }

    }

    }
  return (Hosts);
});


//Alternative solution to brower ping
// function Pinger_ping(ip, callback) {
//
// if(!this.inUse) {
//
// this.inUse = true;
// this.callback = callback
// this.ip = ip;
//
// var _that = this;
// console.log(_that);
//
// this.img = new Image();
//
// this.img.onload = function() {
//   _that.inUse = false;
//   _that.callback('responded');
// };
// this.img.onerror = function (e) {
//   if (_that.inUse) {
//       _that.inUse = false;
//       _that.callback('responded', e);
//   }
// };
//
// this.start = new Date().getTime();
// this.img.src = "http://" + ip + "/?cachebreaker="+new Date().getTime();
// this.timer = setTimeout(function () {
//   if (_that.inUse) {
//       _that.inUse = false;
//       _that.callback('timeout');
//   }
// }, 1500);
//
// }
// }


// var test = new Pinger_ping('192.168.55.163', function (status, e){
//   var time = e.timeStamp - this.start
//   console.log('Status: ' + status + ' in ' + time + 'ms');
// });
