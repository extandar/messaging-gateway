"use strict";
const nodemailer = require("nodemailer");

const LogService = require('../logService');
const HandledHtmlError = require('../../exceptions/HandledHtmlError');

const { MailSent } = require('../../models');

const PROVIDER = 'smtp';
const SMTP_SENDER_USER = process.env.SMTP_SENDER_USER;
const SMTP_SENDER_PASSWORD = process.env.SMTP_SENDER_PASSWORD;
const SMTP_SENDER_HOST = process.env.SMTP_SENDER_HOST;
const SMTP_SENDER_PORT = process.env.SMTP_SENDER_PORT;


const service = {

	send: async function (message) {

		console.log("Sending from SMTP provider");

		const lang = 'en';
		const { _id, from, replyTo, to, cc, bcc, subject, text, html, template, templateData } = message;
		

		let transporter = nodemailer.createTransport({
		    host: SMTP_SENDER_HOST,
		    port: SMTP_SENDER_PORT,
		    secure: true, // true for 465, false for other ports
		    auth: {
		      user: SMTP_SENDER_USER,
		      pass: SMTP_SENDER_PASSWORD,
		    },
		  });

		const fromSMTP = from.name?`"${from.name}" <${from.email}>`:from.email;
		
		let recipients = []
		for(let recipient of to){
			recipients.push(recipient.email.trim());
		}

		const toSMTP = recipients.join(',');

		const msg = {
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


		message.events.push({
			status:  'sent',
			date: new Date()
		})
		message.status = 'sent';

		console.log(msg)
		
		await message.save();

		
		
		/*
		// verify connection configuration
		transporter.verify(function (error, success) {
		  if (error) {
		    console.log(error);
		  } else {
		    console.log("Server is ready to take our messages");
		  }
		});
		*/

		await transporter
		  .sendMail(msg)
		  .then( async (response) => {

			  	try{
			  		message.events.push({
						status:  'delivered',
						date: new Date(),
						info: response
					})
					message.status = 'delivered';

					let messageCopy = message.toJSON();
					delete messageCopy._id;

					let sent = new MailSent(messageCopy);
					sent.provider = PROVIDER;
					await sent.save();
					await message.delete();

			  		LogService.debug("Mensaje enviado por SMTP", 'MailSentBySMTP' , null, response);
			  	}catch(err){
			  		console.error(err);
			  	}
		  		
		  	}, async (error) => {
		  		
		  		console.log("Error enviando por SMTP");
		  		console.log(error);
		  		try{
		  			message.events.push({
						status:  'errored',
						date: new Date(),
						info: error
					})
					message.status = 'errored';

					let messageCopy = message.toJSON();
					delete messageCopy._id;

					let sent = new MailSent(messageCopy);
					sent.provider = PROVIDER;
					await sent.save();
					await message.delete();

			    	let err = new HandledHtmlError('ProviderError', lang, error);
				    if (error.response) {
	          			LogService.error(err.message, err.errorCode, null, error.response.body);
				    }else{
				    	LogService.error(err.message, err.errorCode, null, error);
				    }
		  		}catch(err){
		  			console.error(err);
		  		}
		  		

		  });
	

	  	
	},

}
 
module.exports = service;
