
const MailSentCrudService = require('../services/mailSentCrudService');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

/*
* 	Must access by GET method
*	Execute a query in the collection MailSent
*	filter is Object
* 	limit is an Number
*/

exports.getAllMailSents = function(req, res) {

	const lang = req.lang;

	try{
	
		let options = {
			filter : req.params.filter || {},
			limit : ( req.params.limit * 1 ) || 100
		}

		MailSentCrudService.getAllMailSents(options)
		.then(data =>{
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

/*
*  Search one MailSent by id
*/
exports.getOneMailSent = function(req, res) {

	const lang = req.lang;

	try{

		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		MailSentCrudService.getOneMailSent({ _id:id })
		.then(data =>{
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


/*
*	Create one MailSent
*/

exports.createOneMailSent = function(req, res) {	

	const lang = req.lang;
	
	const { body } = req;

	try{

		
		if(!body.emisor){
			throw new HandledHtmlError("EmisorRequired", lang);
		}
			
		let payload = {};
			
		if(body.messageId){
			payload.messageId = body.messageId;
		}
				
		if(body.emisor){
			payload.emisor = body.emisor;
		}
				
		if(body.status){
			payload.status = body.status;
		}
				
		if(body.priority){
			payload.priority = body.priority;
		}
				
		if(body.provider){
			payload.provider = body.provider;
		}
				
		if(body.messageIdProvider){
			payload.messageIdProvider = body.messageIdProvider;
		}
				
		if(body.tags){
			payload.tags = body.tags;
		}
				
		if(body.from){
			payload.from = body.from;
		}
				
		if(body.replyTo){
			payload.replyTo = body.replyTo;
		}
				
		if(body.to){
			payload.to = body.to;
		}
				
		if(body.cc){
			payload.cc = body.cc;
		}
				
		if(body.bcc){
			payload.bcc = body.bcc;
		}
				
		if(body.subject){
			payload.subject = body.subject;
		}
				
		if(body.text){
			payload.text = body.text;
		}
				
		if(body.html){
			payload.html = body.html;
		}
				
		if(body.attachments){
			payload.attachments = body.attachments;
		}
				
		if(body.schedule){
			payload.schedule = body.schedule;
		}
				
		if(body.template){
			payload.template = body.template;
		}
				
		if(body.templateData){
			payload.templateData = body.templateData;
		}
				
		if(body.events){
			payload.events = body.events;
		}
		
	MailSentCrudService.createOneMailSent(payload)
		.then(data =>{
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


/*
*	Update one MailSent
*/
exports.updateOneMailSent = async function(req, res) {

	const lang = req.lang;

	const { body } = req;

	try{


		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		let payload = {};

			
		if(body.messageId){
			payload.messageId = body.messageId;
		}
				
		if(body.emisor){
			payload.emisor = body.emisor;
		}
				
		if(body.status){
			payload.status = body.status;
		}
				
		if(body.priority){
			payload.priority = body.priority;
		}
				
		if(body.provider){
			payload.provider = body.provider;
		}
				
		if(body.messageIdProvider){
			payload.messageIdProvider = body.messageIdProvider;
		}
				
		if(body.tags){
			payload.tags = body.tags;
		}
				
		if(body.from){
			payload.from = body.from;
		}
				
		if(body.replyTo){
			payload.replyTo = body.replyTo;
		}
				
		if(body.to){
			payload.to = body.to;
		}
				
		if(body.cc){
			payload.cc = body.cc;
		}
				
		if(body.bcc){
			payload.bcc = body.bcc;
		}
				
		if(body.subject){
			payload.subject = body.subject;
		}
				
		if(body.text){
			payload.text = body.text;
		}
				
		if(body.html){
			payload.html = body.html;
		}
				
		if(body.attachments){
			payload.attachments = body.attachments;
		}
				
		if(body.schedule){
			payload.schedule = body.schedule;
		}
				
		if(body.template){
			payload.template = body.template;
		}
				
		if(body.templateData){
			payload.templateData = body.templateData;
		}
				
		if(body.events){
			payload.events = body.events;
		}
		
	MailSentCrudService.updateOneMailSent(id, payload)
		.then(data =>{
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


/*
*	Delete one MailSent
*/
exports.deleteOneMailSent = function(req, res) {

	const lang = req.lang;

	const { body } = req;

	try {
		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}
	
	MailSentCrudService.deleteOneMailSent(id)
		.then(data =>{
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

