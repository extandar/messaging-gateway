
'use strict';

const { Emisor } = require('../models');

const service = {

	/*
	*  Get all  Emisors
	*/
	getAllEmisors : function (options) {

		return new Promise((resolve, reject) => {

			let query = Emisor
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
	*  Get one Emisor by a filter
	*/
	getOneEmisor : function (filter) {

		return new Promise((resolve, reject) => {

			let query = Emisor
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
	*  Create a new Emisor
	*/
	createOneEmisor: function (payload) {

		return new Promise((resolve, reject) => {

			let newEmisor = new Emisor(payload);

	  		newEmisor.save()
		  		.then(function (createdDocument) {
					resolve(createdDocument);
				})
				.catch(error=>{
					reject(error);
				})

		});


	},

	/*
	*  Update one Emisor
	*/
	updateOneEmisor:  function (id, changes) {

		return new Promise((resolve, reject) => {

			Emisor.findByIdAndUpdate(id, changes)
			.then(document =>{
				resolve(document);
			})
			.catch(error=>{
				reject(error);
			})

		});

	},

	/*
	*  Delete one Emisor
	*/
	deleteOneEmisor:  function (id) {

		return new Promise((resolve, reject) => {

			Emisor.findOneAndDelete({ _id:id })
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
