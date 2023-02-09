const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');
const EmisorService = require('../services/emisorService');

/*
	Generate an apiKey for an specific emisor
*/

exports.createApiKey = async function(req, res) {

	const lang = req.language;

	const { body } = req;

	try{

		if(!body.emisorId){
			throw new HandledHtmlError('NeedEmisorId', lang);
		}

		if(!body.title){
			throw new HandledHtmlError('NeedTitle', lang);
		}

		if(!body.services){
			throw new HandledHtmlError('NeedServices', lang);
		}

		let payload = {
			title: body.title
		};

		if(body.services.includes('email')){
			
			if(!req.body.emailProviders){
				throw new HandledHtmlError('NeedEmailProviders', lang);
			}

			if(!req.body.emailSender){
				throw new HandledHtmlError('NeedEmailSender', lang);
			}

			payload.emailProviders = req.body.emailProviders;

			payload.emailSender = req.body.emailSender;

			if(body.emailTemplateId){
				payload.emailTemplateId = body.emailTemplateId;
			}

		}else{
			throw new HandledHtmlError('OnlySupportEmailYet', lang);
		}

		EmisorService.createApiKey(body.emisorId, payload)
			.then(data =>{
				res.json({ resultSet: data, message: 'ok' });
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
