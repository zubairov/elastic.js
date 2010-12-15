var parseURL = require('url').parse,
	http = require('http');

/**
 * Util version.
 */
exports.version = '0.0.1';

/**
 * Exporting functions
 */
exports.fetchJSON = fetchJSON;
exports.parser = require('./xml2json').parser;

/**
 * Function for convinient JSON 
 * fetching from remote URL and parsing
 *
 * @param url
 * @param callback
 * @api public
 */
function fetchJSON(uri, callback) {
	var url = parseURL(uri);
	// Checking proxy from environment variable
	var proxy = checkProxy();
	if (proxy) {
		var client = http.createClient(proxy.port, proxy.host);
	} else {
		var client = http.createClient(url.port, url.hostname);
	}
	var request = client.request('GET', uri,
	  {'host': url.hostname,
	   'User-Agent' : 'elastic'});
	request.end();
	request.on('response', function (response) {
		var responder = responders[response.statusCode] || responders["other"];
		responder(response, callback);
	});
}

// An associative array that replaces a switch
// based on the HTTP Response codes
var responders = {
	"200" : function(response, callback) {
		response.setEncoding('utf8');
		var buf = new String();
		response.on('data', function (chunk) {
			buf += chunk;
		});
		response.on('end', function() {
			try {
				var response = JSON.parse(buf);
				callback(null, response);
			} catch (error) {
				callback(error);
			}
		});
	},
	"404" : function(response, callback) {
		callback("Resource not found : 404");
	},
	"301" : function(response, callback) {
		var location = response.headers['location'];
		if (location) {
			fetchJSON(location, callback);
		} else {
			callback("Resource moved (301) but location is unspecified");
		}
	},
	"other" : function(response, callback) {
		callback("Can't fetch resource, http status code is " + response.statusCode);
	}
}


// Function that checks environment for proxy env. variables
function checkProxy() {
	var undefined;
	var proxy = process.env.http_proxy;
	var result = undefined;
	if (proxy) {
		// We expect proxy in form of http://localhost:3128
		var url = parseURL(proxy);
		result = {};
		result = {
			"host": url.hostname,
			"port": url.port
		};
		console.log("HTTP Proxy Detected: going to use this proxy:" 
			+ JSON.stringify(proxy));
	}
	return result;
}