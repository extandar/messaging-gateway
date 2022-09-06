
const errors = require('./errors');

class HandledHtmlError extends Error {
	
	constructor(errorCode = "SomethingFailed", language = 'en', stackTrace) {
		
		let error = errors.find(element => {
			return element.errorCode == errorCode;
		})

		//Fallback if passed errorCode was not found
		if(!error){
			console.log("Not found error: "+errorCode);
			error = errors.find(element => {
				return element.errorCode == 'SomethingFailed';
			})
		}

		let message = error.translations[language];
		
		super(message);
		this.htmlCode = error.htmlCode;
		this.errorCode = error.errorCode;
		this.stackTrace = stackTrace;
	}

}

module.exports = HandledHtmlError;
