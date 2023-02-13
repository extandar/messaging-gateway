
const MailQueuedCrudService = require('../services/mailQueuedCrudService');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

/*
* 	Must access by GET method
*	Execute a query in the collection MailQueued
*	filter is Object
* 	limit is an Number
*/

exports.getAllMailQueueds = function(req, res) {

	const lang = req.lang;

	try{
	
		let options = {
			filter : req.params.filter || {},
			limit : ( req.params.limit * 1 ) || 100
		}

		MailQueuedCrudService.getAllMailQueueds(options)
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
*  Search one MailQueued by id
*/
exports.getOneMailQueued = function(req, res) {

	const lang = req.lang;

	try{

		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		MailQueuedCrudService.getOneMailQueued({ _id:id })
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
*	Create one MailQueued
*/

exports.createOneMailQueued = function(req, res) {	

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
				
		if(body.apiKey){
			payload.apiKey = body.apiKey;
		}
				
		if(body.provider){
			payload.provider = body.provider;
		}
				
		if(body.messageIdProvider){
			payload.messageIdProvider = body.messageIdProvider;
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
		
	MailQueuedCrudService.createOneMailQueued(payload)
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
*	Update one MailQueued
*/
exports.updateOneMailQueued = async function(req, res) {

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
				
		if(body.apiKey){
			payload.apiKey = body.apiKey;
		}
				
		if(body.provider){
			payload.provider = body.provider;
		}
				
		if(body.messageIdProvider){
			payload.messageIdProvider = body.messageIdProvider;
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
		
	MailQueuedCrudService.updateOneMailQueued(id, payload)
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
*	Delete one MailQueued
*/
exports.deleteOneMailQueued = function(req, res) {

	const lang = req.lang;

	const { body } = req;

	try {
		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}
	
	MailQueuedCrudService.deleteOneMailQueued(id)
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

