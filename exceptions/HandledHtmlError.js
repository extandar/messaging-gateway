const errors = require('./errors');

class HandledHtmlError extends Error {
	
	constructor(errorCode = "SomethingFailed", language = 'en', previousError) {
		
		if(previousError && previousError instanceof HandledHtmlError){
			return previousError;
		}

		let error = errors.find(element => {
			return element.errorCode == errorCode;
		})

		//Fallback if passed errorCode was not found
		if(!error){
			error = errors.find(element => {
				return element.errorCode == 'SomethingFailed';
			})
		}

		let message = error.translations[language];
		
		super(message);
		this.htmlCode = error.htmlCode;
		
		this.errorCode = errorCode;
		this.previousError = previousError;
	}

}

module.exports = HandledHtmlError;
