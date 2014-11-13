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
var metrics = require('measured');

		var p = os.platform();


module.exports = {
	getPing: function (req, res, next){
		var ip = req.param('ip');
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

		},
		getStats: function (req, res){
			var host = req.param('host');
			var histogram = new metrics.Histogram();
			var records = Ping.find({host: host, sort: 'y DESC'}, function(err, data){
				if (err){
					res.status(400).end();
				}
				var total = 0;
				var count = data.length;
				data.forEach(function(rec){
					rec.y ? total+= rec.y : count--;
					rec.y ? histogram.update(rec.y) : rec.y;
				});
				var average = (total/data.length).toFixed(2);
				res.json({host: host, avg: average, total: total.toFixed(2), count: count, max: histogram.max, histogram: histogram});
			});
		},
		getSocketId: function (req, res){
			if (!req.isSocket) return res.badRequest();

  			var socketId = sails.sockets.id(req.socket);
				res.json({id: socketId});
  			return res.ok('My socket ID is: ' + socketId);
		},
		getTime: function (req, res){
			//Get Parameters from request
			var time = req.param('time'),
					host = req.param('host'),
					temp = [],
					results = [],
					//Find records where parameters are met
					records = Ping.find({host: host, time: time}, function(err, data){
						if (err){
							res.status(400).end();
						}
						//Loop through returned records and push unique socketids to temp array
						data.forEach(function(data){
							temp.length === 0 ? temp.push(data.socketId) : temp.indexOf(data.socketId) === -1 ? temp.push(data.socketId) : temp;
						});
						function avg (socId){
							var sum = 0,
									count = 0,
									avg = 0.0;
							data.forEach(function(val){
								if (val.socketId === socId){
									sum+=val.y;
									count++;
								}
							});
							var avg = sum/count;
							results.push({host: host, time: time, y: avg.toFixed(2), socketId: socId})
						}
						for (var i = 0, x = temp.length; i < x; i++){
							avg(temp[i]);
						}
						sails.sockets.blast('chart', results );
						res.json(results);
					});
		}


};
