/**
 * PingController
 *
 * @description :: Server-side logic for managing pings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Monitor = require('ping-monitor'),
		cp = require('child_process'),
		os = require('os'),
		hosts = [];


		var p = os.platform();


module.exports = {
	getPing: function (req, res, next){
		var ip = req.param('ip');
		// var hosts = ['10.6.4.20', '192.168.54.205'];
		// hosts.forEach(function(host){
		var start = +new Date;
		var end;
		var outstring = "";

        if (p === 'linux') {
            //linux
            ls = cp.spawn('/bin/ping', ['-n', '-w 2', '-c 1', ip]);

        } else if (p.match(/^win/)) {
            //windows
            ls = cp.spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', ip]);
        } else if (p === 'darwin') {
            //mac osx
            ls = cp.spawn('/sbin/ping', ['-n', '-t 2', '-c 1', ip]);
						end = +new Date;
        }

        ls.on('error', function (e) {
            var err = new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
            cb(null, err);
        });
				// console.log(ls);
				ls.stdout.on('data', function (data) {
						// var json = JSON.stringify(data);
            outstring+= String(data);
						res.send(outstring);
        });

	}




};
