
const MailQueueService = require('../services/mailQueueService');
const MailQueuedCrudService = require('../services/mailQueuedCrudService');
const LogService = require('../services/logService');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const crypto = require('crypto');

/*
	Create a document in the mailQueued collection and active the engine
*/

exports.enqueue = function(req, res) {

	const lang = req.language;
	
	try {

		if(!req.emisorId){
			throw new HandledHtmlError("EmisorRequired", lang);
		}

		const { body } = req;

		if(!body.from || !body.from.email){
			throw new HandledHtmlError("FromRequired", lang);
		}

		if(!body.to){
			throw new HandledHtmlError("ToRequired", lang);
		}

		if(!body.subject){
			throw new HandledHtmlError("SubjectRequired", lang);
		}

		if(!body.text){
			throw new HandledHtmlError("TextRequired", lang);
		}

		let payload = {
			emisor: req.emisorId,
			from: body.from,
			to: body.to,
			subject: body.subject,
			text: body.text,
			html: body.html,
		};

		if(body.priority){
			payload.priority = body.priority;
		}	

		if(body.replyTo){
			payload.replyTo = body.replyTo;
		}	

		if(body.cc){
			payload.cc = body.cc;
		}	

		if(body.bcc){
			payload.bcc = body.bcc;
		}

		if(body.template){
			payload.template = body.template;
		}

		if(body.templateData){
			payload.templateData = body.templateData;
		}	

		payload.schedule = req.body.schedule ? new Date(req.body.schedule) : new Date();

		const apiKey = req.apiKey;

		if(body.provider){

			if(apiKey.emailProviders.includes(body.provider)){
				payload.provider = body.provider;
			}else{
				throw new HandledHtmlError("NotAllowedProvider", lang);
			}
			
		}else{
			
			//Selecte the first one provider like the default
			payload.provider = apiKey.emailProviders[0];
		}

		payload.apiKey = apiKey.key;
		
		payload.events = [
			{
				status: 'queued',
				date: new Date()
			}
		]

		const dateHash = crypto.createHash('md5').update((new Date()).toString()).digest("hex");

		payload.messageId = `${dateHash}-${body.from.email}`;

		MailQueuedCrudService.createOneMailQueued(payload)
			.then(data =>{

				MailQueueService.processQueue();
				res.json({ resultSet: data, status: 'OK' });
			})
			.catch(error=>{

				error = new HandledHtmlError('SomethingFailed', lang, error);
				LogService.error(error.message, error.errorCode, req, error);
				res.status(error.htmlCode).send({ status: "FAILED", message: error.message, code: error.errorCode });
			})

	}catch(error){

		error = new HandledHtmlError('SomethingFailed', lang, error);
		LogService.error(error.message, error.errorCode, req, error);
		res.status(error.htmlCode).send({ status: "FAILED", message: error.message, code: error.errorCode });
	}
	
};
