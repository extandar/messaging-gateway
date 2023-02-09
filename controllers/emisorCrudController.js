
const EmisorCrudService = require('../services/emisorCrudService');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

/*
* 	Must access by GET method
*	Execute a query in the collection Emisor
*	filter is Object
* 	limit is an Number
*/

exports.getAllEmisors = function(req, res) {

	const lang = req.lang;

	try{
	
		let options = {
			filter : req.params.filter || {},
			limit : ( req.params.limit * 1 ) || 100
		}

		EmisorCrudService.getAllEmisors(options)
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
*  Search one Emisor by id
*/
exports.getOneEmisor = function(req, res) {

	const lang = req.lang;

	try{

		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		EmisorCrudService.getOneEmisor({ _id:id })
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
*	Create one Emisor
*/

exports.createOneEmisor = function(req, res) {	

	const lang = req.lang;
	
	const { body } = req;

	try{


		let payload = {};
			
		if(body.title){
			payload.title = body.title;
		}
				
		if(body.isActive){
			payload.isActive = body.isActive;
		}
				
		if(body.apiKeys){
			payload.apiKeys = body.apiKeys;
		}
		
	EmisorCrudService.createOneEmisor(payload)
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
*	Update one Emisor
*/
exports.updateOneEmisor = async function(req, res) {

	const lang = req.lang;

	const { body } = req;

	try{


		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		let payload = {};

			
		if(body.title){
			payload.title = body.title;
		}
				
		if(body.isActive){
			payload.isActive = body.isActive;
		}
				
		if(body.apiKeys){
			payload.apiKeys = body.apiKeys;
		}
		
	EmisorCrudService.updateOneEmisor(id, payload)
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
*	Delete one Emisor
*/
exports.deleteOneEmisor = function(req, res) {

	const lang = req.lang;

	const { body } = req;

	try {
		const id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}
	
	EmisorCrudService.deleteOneEmisor(id)
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

