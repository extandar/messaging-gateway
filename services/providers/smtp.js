"use strict";

const nodemailer = require("nodemailer");

const LogService = require('../logService');
const passwordService = require('../passwordService');

const HandledHtmlError = require('../../exceptions/HandledHtmlError');

const { MailSent } = require('../../models');

const PROVIDER = 'smtp';

const EmisorService = require('../emisorService');

const service = {

	send: function (message) {

		console.log("Sending from SMTP provider...");
		
		const lang = 'en';
		const { messageId, apiKey, from, replyTo, to, cc, bcc, subject, text, html } = message;
		
		return new Promise((resolve, reject) => {

			EmisorService.getApiKey(apiKey)
				.then( apiKey =>{
				
					let transporter  = this.prepareTransport(apiKey.emailSender);
					let smtpMsg = this.prepareSmtpMessage(message);
					
					message = this.processSentMessage(message);

					transporter
				  	.sendMail(smtpMsg)
				  	.then( (response) => {
					  	
					  	try{

					  		LogService.debug('Message delivered by smtp:'+messageId, null, null, response);

					  		message.events.push({
								status:  'delivered',
								date: new Date(),
								info: response
							})
							message.status = 'delivered';
							message.messageIdProvider = response.messageId;

							let messageCopy = message.toJSON();
							delete messageCopy._id;

							let sent = new MailSent(messageCopy);
							sent.save()
								.then( (createdDocument) => {

									message.delete()
										.then( (deletedDocument) =>{
											resolve(response);
										})
										.catch(error => {
											LogService.error('Error deleting delivered MailQueued:'+messageId, null, null, error);
											reject(error);
										})

								})
								.catch(error=>{
									LogService.error('Error saving delivered MailSent:'+messageId, null, null, error);
									reject(error);
								})
							

					  	}catch(error){
					  		LogService.error('Error processing smpt response:'+messageId, null, null, error);
					  		reject(error);
					  	}


				  	})
				  	.catch( error => {

				  		try{

				  			LogService.error('Error sending smtp:'+messageId, null, null, error);

				  			message.events.push({
								status:  'errored',
								date: new Date(),
								info: error
							})
							message.status = 'errored';

							let messageCopy = message.toJSON();
							delete messageCopy._id;

							let sent = new MailSent(messageCopy);
							sent.save()
								.then( (createdDocument) => {

									message.delete()
										.then( (deletedDocument) => {
											reject(error);
										})
										.catch(error => {
											LogService.error('Error deleting errored MailQueued:'+messageId, null, null, error);
											reject(error);
										})

								})
								.catch(error => {
									LogService.error('Error saving errored MailSent:'+messageId, null, null, error);
									reject(error);
								})

				  		}catch(error){
				  			LogService.error('Error processing smpt error:'+messageId, null, null, error);
				  			reject(error);
				  		}
				  		
				  	})
				})
				.catch( error => {
					LogService.error('Error retrieving apiKey:'+messageId, null, null, error);
					//TODO - If apiKey not founded process message like errored
					reject(error);
				})

		});

	},

	prepareTransport : function (payload){

		let decryptedPassword = passwordService.decrypt(payload.password);

		const transporter = nodemailer.createTransport({
		    host: payload.host,
		    port: payload.port,
		    secure: true, // true for 465, false for other ports
		    auth: {
		      user: payload.email,
		      pass: decryptedPassword,
		    },
		  });
		return transporter

	},

	prepareSmtpMessage : function (message){

		const { messageId, apiKey, from, replyTo, to, cc, bcc, subject, text, html } = message;

		const fromSMTP = from.name?`"${from.name}" <${from.email}>`:from.email;
		
		let recipients = []
		for(let recipient of to){
			recipients.push(recipient.email.trim());
		}

		const toSMTP = recipients.join(',');

		//console.log(text)

		let msg = {
			from: fromSMTP.trim(),
		  	to: toSMTP.trim(),
		  	subject: subject,
		  	text: text,
		  	html: html,
		};

		if(replyTo && replyTo.email){
			msg.replyTo = replyTo
		}

		if(cc && cc.length>0){
			msg.cc = cc
		}

		if(bcc && bcc.length>0){
			msg.bcc = bcc
		}

		return msg;

	},

	processSentMessage : function (message){
		
		message.events.push({
			status:  'sent',
			date: new Date()
		})

		message.status = 'sent';
		
		message.save()
			.then(( document )=>{
				LogService.debug('Message sent for delivery smtp:'+message.messageId);
			})
			.catch(error=>{
				LogService.error('Error saving sent MailSent:'+message.messageId, null, null, error);
			})

		return message;
	},



}
 
module.exports = service;
