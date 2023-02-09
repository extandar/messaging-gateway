var logTransports = process.env.LOG_TRANSPORTS ? (process.env.LOG_TRANSPORTS).split(',') : [];

const infoTransport = logTransports[0] || 'console';
const warnTransport = logTransports[1] || 'console';
const errorTransport = logTransports[2] || 'console';
const debugTransport = logTransports[3] || 'console';

var apiEndpointA = process.env.LOG_API_ENDPOINT;
var endpointApiKey = process.env.LOG_API_KEY;

const service = {

	info: async function (message, eventCode, req, data) {

		let level = 'info';	
		let logData = this.makeData(message, req, data);
		
		if(infoTransport == 'console'){
			console.info([level,eventCode,logData]);
		}else{
			this.log(level, eventCode, logData);
		}
	  	
	},

	warn: async function (message, eventCode, req, data) {

		let level = 'warn';	
		let logData = this.makeData(message, req, data);
		
		if(warnTransport == 'console'){
			console.warn([level,eventCode,logData]);
		}else{
			this.log(level, eventCode, logData);
		}
	  	
	},

	error: async function (message, eventCode, req, data) {

		let level = 'error';	
		let logData = this.makeData(message, req, data);

		if(errorTransport == 'console'){
			console.error([level,eventCode,logData]);
			if(data.previousError){
				console.error(data.previousError);	
			}
			
		}else{
			this.log(level, eventCode, logData);
		}
	  	
	},

	debug: async function (message, eventCode, req, data) {

		let level = 'debug';	
		let logData = this.makeData(message, req, data);
		
		if(debugTransport == 'console'){
			console.debug([level,eventCode,logData]);
		}else{
			this.log(level, eventCode, logData);
		}
	  	
	},

	makeData (message, req, data){

		let logData = {
			message: message,
			time: new Date().toISOString()
		}

		if(req){
	
			if(req.userId){
				logData.userId = req.userId;
			}

			if(req.body){
				logData.body = req.body;
			}

			//TODO 
			// log ip of req

		}

		if(data){
			logData.data = data;
		}

		return logData;

	},

	/*
		level : info | warn | error | debug
	*/

	log: async function (level, eventCode, data) {
		
		//TODO
		console.log("loggging....")
	  	
	},
}
 
module.exports = service;



