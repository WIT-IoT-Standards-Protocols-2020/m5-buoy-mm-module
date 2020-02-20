
/* Magic Mirror
 * Module: m5-buoy
 *
 * By fxwalsh
 * MIT Licensed.
 */

Module.register('m5-buoy',{

	defaults: {
		units: config.units,
		animationSpeed: 1000,
		updateInterval: 1000 * 3600, //update every hour
		refreshInterval: 1000 * 60 * 10, //refresh every minute		
		timeFormat: config.timeFormat,
		lang: config.language,

		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,
        fileUrl: 'https://erddap.marine.ie//erddap/tabledap/IWBNetwork.json?longitude,latitude,time,AtmosphericPressure,WindDirection,WindSpeed,WaveHeight,WavePeriod,MeanWaveDirection,AirTemperature,SeaTemperature&time>=2020-02-20T00:00:00.000Z&station_id="M5"&orderByMax("time")'
    },

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define requird styles
	getStyles: function() {
		return ["font-awesome.css"];
	},

	start: function() {
		Log.info('Starting module: ' + this.name);

		this.loaded = false;
		this.sendSocketNotification('CONFIG', this.config);
	},

	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.data) {
			wrapper.innerHTML = "No data";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var t = this.data.graph;
		var content = document.createElement("div");
		content.innerHTML = "";	
		
		for (var i in t.datasequences) {
			content.innerHTML += t.title  + " - " + t.datasequences[i].title + "<br />";
			for (var j in t.datasequences[i].datapoints) {
				content.innerHTML += t.datasequences[i].datapoints[j].title + ": " + t.datasequences[i].datapoints[j].value + "<br />";
			}
		}
		
		wrapper.appendChild(content);

		return wrapper;
	},

 	socketNotificationReceived: function(notification, payload) {
    		if (notification === "STARTED") {
				this.updateDom();
			}
			else if (notification === "DATA") {
				this.loaded = true;
				this.processData(JSON.parse(payload));
				this.updateDom();
    		}
	},

	/* processData(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - tide information received form worldtides.info
	 */
	processData: function(data) {

		if (!data) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}

		this.data = data;

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	}

});