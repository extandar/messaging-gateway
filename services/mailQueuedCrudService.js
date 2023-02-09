
'use strict';

const { MailQueued } = require('../models');

const service = {

	/*
	*  Get all  MailQueueds
	*/
	getAllMailQueueds : function (options) {

		return new Promise((resolve, reject) => {

			let query = MailQueued
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
	*  Get one MailQueued by a filter
	*/
	getOneMailQueued : function (filter) {

		return new Promise((resolve, reject) => {

			let query = MailQueued
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
	*  Create a new MailQueued
	*/
	createOneMailQueued: function (payload) {

		return new Promise((resolve, reject) => {

			let newMailQueued = new MailQueued(payload);

	  		newMailQueued.save()
		  		.then(function (createdDocument) {
					resolve(createdDocument);
				})
				.catch(error=>{
					reject(error);
				})

		});


	},

	/*
	*  Update one MailQueued
	*/
	updateOneMailQueued:  function (id, changes) {

		return new Promise((resolve, reject) => {

			MailQueued.findByIdAndUpdate(id, changes)
			.then(document =>{
				resolve(document);
			})
			.catch(error=>{
				reject(error);
			})

		});

	},

	/*
	*  Delete one MailQueued
	*/
	deleteOneMailQueued:  function (id) {

		return new Promise((resolve, reject) => {

			MailQueued.findOneAndDelete({ _id:id })
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
