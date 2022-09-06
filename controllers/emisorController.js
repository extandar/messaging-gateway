const { Emisor } = require('../models');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');
var jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

/*
	Generate an apiKey for an specific emisor
*/

exports.apiKey = async function(req, res) {

	const lang = req.language;

	try{	

		if(!req.body.appCode){
			throw new HandledHtmlError('InfoIncomplete', lang);
		}

		if(!req.body.title){
			throw new HandledHtmlError('InfoIncomplete', lang);
		}

		let emisor = await Emisor.findOne({ appCode: req.body.appCode });

		if(!emisor){
			throw new HandledHtmlError('EmisorDoNotExist', lang);
		}

		var apiKey = jwt.sign(
			{ 
				appCode: emisor.addCode, 
				id: emisor._id 
			},
			secret
		);

		emisor.apiKeys.push({
			title: req.body.title,
			key: apiKey
		})

		await emisor.save();

		res.json({ resultSet: { key: apiKey } , message: 'ok' });

	}catch(err){
		if(!(err instanceof HandledHtmlError)){
			err = new HandledHtmlError('SomethingFailed', lang, err);
		}
		LogService.error(err.message, err.errorCode, req, err);
		res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
	}
	
};
