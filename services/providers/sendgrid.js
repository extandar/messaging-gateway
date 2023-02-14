"use strict";

const sgMail = require('@sendgrid/mail');

const LogService = require('../logService');
const passwordService = require('../passwordService');
const HandledHtmlError = require('../../exceptions/HandledHtmlError');
const { MailSent } = require('../../models');
const EmisorService = require('../emisorService');

const PROVIDER = 'sendgrid';

const service = {

	send: function (message) {

		console.log("Sending from Sendgrid provider...");
		
		const lang = 'en';
		const { messageId, apiKey, from, replyTo, to, cc, bcc, subject, text, html } = message;
		
		return new Promise((resolve, reject) => {

			EmisorService.getApiKey(apiKey)
				.then( apiKey =>{
				
					let transporter  = this.prepareTransport(apiKey.emailSender);
					let preparedMessage = this.prepareMessage(message);
					
					message = this.processSentMessage(message);

					if(!transporter){
						throw new HandledHtmlError("ErroredTransport");
					}

					transporter
				  	.send(preparedMessage)
				  	.then( (response) => {
					  	
					  	try{

					  		LogService.debug(`Message delivered by ${PROVIDER}: ${messageId}`, null, null, response);

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

					  		LogService.error(`Error processing ${PROVIDER}: ${messageId}`, null, null, error);
					  		reject(error);
					  	}


				  	})
				  	.catch( error => {

			  			LogService.error(`Error sending ${PROVIDER}: ${messageId}`, null, null, error);
			  			message = this.processErroredMessage(message, error);
			  			reject(error);	
				  	})
				})
				.catch( error => {

					LogService.error('Error retrieving apiKey:'+messageId, null, null, error);
					message = this.processErroredMessage(message, error);
					reject(error);
				})

		});

	},

	prepareTransport : function (emailSender){

		return sgMail.setApiKey(emailSender.apiKey);

	},

	prepareMessage : function (message){

		const { messageId, apiKey, from, replyTo, to, cc, bcc, subject, text, html } = message;

		const formattedFrom = from.name?`${from.name}<${from.email}>`:from.email;
		
		let recipients = []
		for(let recipient of to){
			recipients.push(recipient.email.trim());
		}

		const formattedTo = recipients.join(',');

		//console.log(text)

		let msg = {
			from: formattedFrom.trim(),
		  	to: formattedTo.trim(),
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
				LogService.debug('Message sent for delivery sendgrid:'+message.messageId);
			})
			.catch(error=>{
				LogService.error('Error saving sent MailSent:'+message.messageId, null, null, error);
			})

		return message;
	},


	processErroredMessage : function (message, error){

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
						LogService.debug('deleted MailQueued:'+message.messageId);
					})
					.catch(error => {
						LogService.error('Error deleting errored MailQueued:'+message.messageId, null, null, error);
					})

			})
			.catch(error => {
				LogService.error('Error saving errored MailSent:'+message.messageId, null, null, error);
			})

	}



}
 
module.exports = service;
