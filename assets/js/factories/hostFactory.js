'use strict';

angular.module('corPingApp')
  .factory('HostFact', function(){
    var hosts = [];
    var Hosts = function (){
      this.setHost = function (name, alias, host) {
        hosts.push({name: name, alias: alias, host: host});
      };
      this.getHosts = function (){
        return hosts;
      };
    }
  return (Hosts);
});
