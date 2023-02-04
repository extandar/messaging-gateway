const { Emisor, MailQueued, MailSent } = require('../models');

const MailQueueService = require('../services/mailQueueService');
const LogService = require('../services/logService');
const HandledHtmlError = require('../exceptions/HandledHtmlError');

/*
	Create a document in the mailQueued collection and active the engine
*/

exports.enqueue = async function(req, res) {

	const lang = req.language;

	try{	
		
		if(!req.emisorId){
			throw new HandledHtmlError("EmisorRequired", lang);
		}
		
		console.log(req.body)

		req.body.emisor = req.emisorId;

		if(!req.body.from){
			throw new HandledHtmlError("FromRequired", lang);
		}

		if(!req.body.template){
			if(!req.body.to){
				throw new HandledHtmlError("ToRequired", lang);
			}
			
			if(!req.body.subject){
				throw new HandledHtmlError("SubjectRequired", lang);
			}
			
			if(!req.body.text){
				throw new HandledHtmlError("TextRequired", lang);
			}
			
			if(!req.body.html){
				req.body.html = req.body.text;
			}
		}

		let payload = req.body;

		payload.priority = req.body.priority || 'low';

		payload.schedule = req.body.schedule ? new Date(req.body.schedule) : new Date();

		let message = await MailQueueService.create(payload);

		MailQueueService.processQueue();

		res.json({ resultSet: message , message: 'ok' });

	}catch(err){
		if(!(err instanceof HandledHtmlError)){
			err = new HandledHtmlError('SomethingFailed', lang, err);
		}
		LogService.error(err.message, err.errorCode, req, err);
		res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
	}
	
};
