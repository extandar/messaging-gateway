
'use strict';

const { Emisor, MailQueued, MailSent } = require('../models');
const MailDefaultProvider = process.env.MAIL_DEFAULT_PROVIDER;
//const MailProvider = require(`./providers/${MailDefaultProvider}.mail`);
const MailProvider = require(`./providers/sendgrid.mail`);
var mailServiceStatus = require('../services/mailServiceStatus.js');

const service = {

	/*
	*  Create a document MailQueued
	*/
	create: async function (payload) {

		
		let _new = new MailQueued();
		
		_new.emisor = payload.emisor;
		
		_new.status = 'queued';
	
		_new.priority = payload.priority;
	
		_new.to = payload.to;
	
		_new.from = payload.from;
	
		_new.subject = payload.subject;
	
		_new.text = payload.text;
		
		_new.html = payload.html;

		_new.provider = payload.provider;

		_new.schedule = payload.schedule;

		_new.events = [];
		
		_new.events.push({
			status:  'queued',
			date: new Date()
		})
		
		_new = await _new.save();

		return _new;
	},

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
	  	
	  	if(mailServiceStatus.getCurrentStatus()=='busy'){
	  		return;
	  	}

	  	mailServiceStatus.setBusy();

	  	let message = await this.getNextMessage();

	  	while(message){

	  		//send the message
	  		await MailProvider.send(message);

	  		//Look for another email
			message = await this.getNextMessage();

	  	}

	  	mailServiceStatus.setReady();

	  	return;
	},

}
 
module.exports = service;
