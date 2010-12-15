var fetchJSON = require('../../util').fetchJSON;

exports.process = function(data, conf, next){
	var username = conf.username || 'zubairov';
	var url = 'http://twitter.com/statuses/user_timeline/' + username + '.json';
	fetchJSON(url, function(err, data) {
		if (err) {
			next(err);
		}
		for(var i in data) {
			next(null, data[i]);
		}
	});
};