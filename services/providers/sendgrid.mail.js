const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const LogService = require('../logService');
const HandledHtmlError = require('../../exceptions/HandledHtmlError');

const { MailSent } = require('../../models');

const service = {

	send: async function (message) {

		const lang = 'en';
		const { _id, to, from, subject, text, html } = message;
		

		const msg = {
		  to: to,
		  from: from,
		  subject: subject,
		  text: text,
		  html: html,
		};

		message.events.push({
			status:  'sent',
			date: new Date()
		})
		message.status = 'sent';
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



