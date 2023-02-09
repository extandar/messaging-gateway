'use strict';

const { Emisor } = require('../models');
var jwt = require("jsonwebtoken");
const SECRET_KEY_32 = process.env.SECRET_KEY_32;
const passwordService = require('./passwordService');

const service = {

	/*
	*  Create an ApiKey
	*/

	createApiKey:  function (id, newKey) {

		var key = jwt.sign(
			{ 
				id: id
			},
			SECRET_KEY_32
		);

		newKey.key = key;

		if(newKey.emailSender && newKey.emailSender.password){
			newKey.emailSender.password = passwordService.encrypt(newKey.emailSender.password);
		}

		let changes = {
			$push: { apiKeys : newKey }
		};

		return new Promise((resolve, reject) => {

			Emisor.findByIdAndUpdate(id, changes, { new:true })
			.then(document =>{
				
				let apiKeyCreated = document.apiKeys.find(element=>{
					return element.key == newKey.key;
				});
				resolve(apiKeyCreated.key);
				
			})
			.catch(error=>{
				reject(error);
			})

		});

	},

	/*
	*  Get an ApiKey Object
	*/

	getApiKey:  function (key) {

		let filter = {
			"apiKeys.key" : key 
		};

		let projection = {
			apiKeys : 1
		};

		return new Promise((resolve, reject) => {

			Emisor.findOne(filter, projection)
				.then(  (document) => { 
					
					if(document){
						let apiKey = document.apiKeys.find((element)=>{
							return element.key == key;
						})

						if(apiKey){
							resolve(apiKey);	
						}else{
							reject("ApiKey not founded");
						}
					}else{
						reject("Emisor with this apiKey not founded");
					}
					
				})
				.catch( (error) =>{
					reject(error)
				})

		});

	},

}

module.exports = service;
