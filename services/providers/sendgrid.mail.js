const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const LogService = require('../logService');
const HandledHtmlError = require('../../exceptions/HandledHtmlError');

const { MailSent } = require('../../models');

const service = {

	send: async function (message) {

		const lang = 'en';
		const { _id, from, replyTo, to, cc, bcc, subject, text, html, template, templateData } = message;
		

		const msg = {
			from: from,
		  	to: to,
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

		if(template){
			msg.template_id = template
			msg.personalizations = [
				{
					to: to,
					dynamic_template_data: templateData

				}
			]
		}

		message.events.push({
			status:  'sent',
			date: new Date()
		})
		message.status = 'sent';

		//console.log(msg)
		
		await message.save();

		//ES6
		await sgMail
		  .send(msg)
		  .then( async (response) => {

			  	try{
			  		message.events.push({
						status:  'delivered',
						date: new Date(),
						infor: response
					})
					message.status = 'delivered';

					let messageCopy = message.toJSON();
					delete messageCopy._id;

					let sent = new MailSent(messageCopy);
					sent.provider = 'sendgrid';
					await sent.save();
					await message.delete();


			  		LogService.debug("Mensaje enviado por Sendgrid", 'MailSentBySendgrid' , null, response);
			  	}catch(err){
			  		console.error(err);
			  	}
		  		
		  	}, async (error) => {
		  		
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
					sent.provider = 'sendgrid';
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



