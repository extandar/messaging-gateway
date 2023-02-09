
'use strict';

const { Emisor, MailQueued, MailSent } = require('../models');
const MAIL_DEFAULT_PROVIDER = process.env.MAIL_DEFAULT_PROVIDER;
const MailProvider = require(`./providers/${MAIL_DEFAULT_PROVIDER}`);

var mailServiceStatus = require('../services/mailServiceStatus.js');

const service = {


	getNextMessage: async function () {

		let now = new Date();

		let message = await MailQueued.findOne({ 
			status: 'queued', 
			priority: 'high', 
			schedule: { $lte: now } 
		});

		if(!message){
			message = await MailQueued.findOne({ 
				status: 'queued', 
				priority: 'medium', 
				schedule: { $lte: now } 
			});
		
			if(!message){
				message = await MailQueued.findOne({ 
					status: 'queued', 
					priority: 'low', 
					schedule: { $lte: now } 
				});
			}
		}
		
		return message;
	},

	processQueue: async function () {
	  	
	  	console.log("processing queue...");
	  	
	  	if(mailServiceStatus.getCurrentStatus()=='busy'){
	  		return;
	  	}

	  	mailServiceStatus.setBusy();

	  	let message = await this.getNextMessage();

	  	while(message){

	  		//send the message
	  		await MailProvider.send(message)
	  			.then( ()=>{})
	  			.catch( (error)=>{})

	  		//Look for another email
			message = await this.getNextMessage();

	  	}

	  	mailServiceStatus.setReady();

	  	return;
	},

}
 
module.exports = service;
