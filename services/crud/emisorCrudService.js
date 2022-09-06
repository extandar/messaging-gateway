
'use strict';

const { Emisor } = require('../../models');
	
var CrudEvents;
try {
  	CrudEvents = require('../events/emisorCrudEvents');
} catch (ex) {}

const service = {

	/*
	*  Create a document Emisor
	*/
	create: async function (payload) {

		if(CrudEvents && CrudEvents.preCreateAction){
			payload = await CrudEvents.preCreateAction(payload);
		}

		
		let _new = new Emisor();
		
		if(payload.hasOwnProperty('appCode')){
			_new.appCode = payload.appCode;
		}
		
		if(payload.hasOwnProperty('quota')){
			_new.quota = payload.quota;
		}
		
		if(payload.hasOwnProperty('isActive')){
			_new.isActive = payload.isActive;
		}
		
		if(payload.hasOwnProperty('allowedDomains')){
			_new.allowedDomains = payload.allowedDomains;
		}
		
		if(payload.hasOwnProperty('defaultSender')){
			_new.defaultSender = payload.defaultSender;
		}
		
		if(payload.hasOwnProperty('apiKeys')){
			_new.apiKeys = payload.apiKeys;
		}
		
		if(CrudEvents && CrudEvents.beforeSaveCreateAction){
			_new = await CrudEvents.beforeSaveCreateAction(_new);
		}

		_new = await _new.save();

		if(CrudEvents && CrudEvents.afterSaveCreateAction){
			_new = await CrudEvents.afterSaveCreateAction(_new);
		}

		return _new;
	},


	/*
	*  Update one document Emisor
	*/
	update: async function (payload) {

		if(CrudEvents && CrudEvents.preUpdateAction){
			payload = await CrudEvents.preUpdateAction(payload);
		}

		
		let _document = await Emisor.findOne({ _id:payload._id });
		
		if(payload.hasOwnProperty('appCode')){
			_document.appCode = payload.appCode;
		}
		
		if(payload.hasOwnProperty('quota')){
			_document.quota = payload.quota;
		}
		
		if(payload.hasOwnProperty('isActive')){
			_document.isActive = payload.isActive;
		}
		
		if(payload.hasOwnProperty('allowedDomains')){
			_document.allowedDomains = payload.allowedDomains;
		}
		
		if(payload.hasOwnProperty('defaultSender')){
			_document.defaultSender = payload.defaultSender;
		}
		
		if(payload.hasOwnProperty('apiKeys')){
			_document.apiKeys = payload.apiKeys;
		}
		
		if(CrudEvents && CrudEvents.beforeSaveUpdateAction){
			_document = await CrudEvents.beforeSaveUpdateAction(_document);
		}

		_document = await _document.save();

		if(CrudEvents && CrudEvents.afterSaveUpdateAction){
			_document = await CrudEvents.afterSaveUpdateAction(_document);
		}

		return _document;
	},

	/*
	*  Delete one document Emisor
	*/
	delete: async function (payload) {

		if(CrudEvents && CrudEvents.preDeleteAction){
			payload = await CrudEvents.preDeleteAction(payload);
		}

		let deletedDocument = await Emisor.deleteOne({ _id:payload._id });
		
		if(CrudEvents && CrudEvents.afterDeleteAction){
			deletedDocument = await CrudEvents.afterDeleteAction(deletedDocument);
		}

		return deletedDocument;

	}


}

module.exports = service;
