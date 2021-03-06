'use strict';

/* Magic Mirror
 * Module: m5-buoy
 *
 * By fxwalsh
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		console.log(moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ') + ' M5-buoy helper started ...');
		this.started = false;
		this.config = null;
	},

	getData: function() {
		var self = this;
		
		var myUrl = this.config.fileUrl;
		console.log(moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ') + ' M5-buoy get Data Request ...');	
		request({
			url: myUrl,
			method: 'GET',
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("DATA", body);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
	
		if (notification === 'CONFIG' && self.started == false) {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
			self.started = true;
		}
	}
});
