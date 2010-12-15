var util = require('util'),
	events = require('events');

function xml2JSON() {
	this.sax = require('sax').parser(true);
	// We are extending eventemitter
	events.EventEmitter.call(this);
	var self = this;
	var stack = [];
	this.sax.onerror = function(err) {
		self.emit('error', err);
	}
	this.sax.onopentag = function(node) {
		var res = {
			// Namespace prefixes are concatenated with element
			name : node.name.replace(':','$')
		};
		res.values = {};
		for(var a in node.attributes) {
			// Namespace prefixes are concatenated with element
			res.values[a.replace(':','$')] = node.attributes[a];
		}
		stack.push(res);
	}
	this.sax.onclosetag = function(tag) {
		if (stack.length > 1) {
			var top = stack.pop();
			var last = stack.pop();
			// We need to take care that we create
			// an array in case child with the same
			// name already exists in parent
			if (last.values[top.name]) {
				var existing = last.values[top.name]
				if (last.values[top.name].push) {
					last.values[top.name].push(top.values);
				} else {
					last.values[top.name] = [
						existing, top.values
					];
				}
			} else {
				last.values[top.name] = top.values;
			}
			stack.push(last);
		}
	}
	this.sax.ontext = function(text) {
		var top = stack.pop();
		if (!top.values.$t) {
			top.values.$t = "";
		}
		top.values.$t = top.values.$t + text;
		stack.push(top);
	}
	this.sax.onend = function() {
		var top = stack.pop();
		var result = {};
		result[top.name] = top.values;
		self.emit('json', result);
	}
}

// Inherit from EventEmitter
util.inherits(xml2JSON, events.EventEmitter);

/**
 * Delegate for this.sax.write
 **/
xml2JSON.prototype.write = function(data) {
	this.sax.write(data);
	return this;
}

/**
 * Delegate for this.sax.close
 **/
xml2JSON.prototype.close = function() {
	this.sax.close();
}


// Exporting
exports.parser = function() { return new xml2JSON(); }
