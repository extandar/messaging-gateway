
'use strict';

const { MailSent } = require('../models');

const service = {

	/*
	*  Get all  MailSents
	*/
	getAllMailSents : function (options) {

		return new Promise((resolve, reject) => {

			let query = MailSent
				.find(options.filter)
				.limit(options.limit);

			query.exec(function(err, data) {

			    if (err) {
					reject(err);
			    }else{
			    	resolve(data)
			    }

	  		});

		});
		
	},

	/*
	*  Get one MailSent by a filter
	*/
	getOneMailSent : function (filter) {

		return new Promise((resolve, reject) => {

			let query = MailSent
				.findOne(filter);

			query.exec(function(err, data) {

			    if (err) {
					reject(err);
			    }else{
			    	resolve(data)
			    }

	  		});

		});
		
	},

	/*
	*  Create a new MailSent
	*/
	createOneMailSent: function (payload) {

		return new Promise((resolve, reject) => {

			let newMailSent = new MailSent(payload);

	  		newMailSent.save()
		  		.then(function (createdDocument) {
					resolve(createdDocument);
				})
				.catch(error=>{
					reject(error);
				})

		});


	},

	/*
	*  Update one MailSent
	*/
	updateOneMailSent:  function (id, changes) {

		return new Promise((resolve, reject) => {

			MailSent.findByIdAndUpdate(id, changes)
			.then(document =>{
				resolve(document);
			})
			.catch(error=>{
				reject(error);
			})

		});

	},

	/*
	*  Delete one MailSent
	*/
	deleteOneMailSent:  function (id) {

		return new Promise((resolve, reject) => {

			MailSent.findOneAndDelete({ _id:id })
			.then(document =>{
				resolve(document);
			})
			.catch(error=>{
				reject(error);
			})

		});

	}


}

module.exports = service;
