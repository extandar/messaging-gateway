const request = require('supertest');
const app = require ('../app');
const db = require('../db.js');
const routes = require('../routes/core.routes');
const routesCrud = require('../routes/crud.routes');

const prefix = process.env.API_PREFIX ? `/api/${ process.env.API_PREFIX }` : '/api';
var mongoose = require('mongoose');

const { Emisor } = require('../models');

describe('Test signup process', () => {


	beforeAll(async () => {

		await db(async client => {
		  console.log("Base de datos conectada.");

		  routes(app, client);
		  routesCrud(app, client);

		  app.use((req, res, next) => {
		      res.status(404).send('Not Found X');
	    	});

		}).catch(e => {
		  console.error(e)
		  app.route('/').get((req, res) => {
		      res.status(503).send("Database doesn't available");
		  });
		});

		//await Emisor.deleteOne({ appCode: 'TestApp' });
		try{
			let emisor = await new Emisor({ appCode: 'TestApp', defaultSender: 'gerencia@disarrollo.com' }).save();	
			emisor.allowedDomains.push('disarrollo.com')
			await emisor.save()

		}catch(e){}
		

    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

	describe('Emisor cycle', () => {
		
		
		const emisor = { "appCode":"TestApp" };
		const apiKeyRequest = { "appCode":"TestApp", "title":"Default" };
		const date = new Date().toISOString();
		const mail = {
			"to":"aroldf@gmail.com", 
			"from":"gerencia@disarrollo.com",
			"subject":"Testing mail at:"+date,
			"text":"Mensaje desde el framework de prueba jest",
		 };
		
		let masterApiKey = "THISISMYMASTERKEY";
		let apiKey;
		let response;

		beforeEach( async () => {
			
		});

		/*
			/emisor/apikey
			This url is for generate a new api key for a specific emisor
			this require the master api key 
		*/

		it('apiKey without master api key', async () => {
			response = await request(app).post(prefix+'/emisor/apikey');

			expect(response.status).toBe(401);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('MasterApiKeyRequired');

		});//OK

		it('apiKey with invalid master api key', async () => {
			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', 'xxxxx');

			expect(response.status).toBe(401);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('MasterApiKeyInvalid');

		});//OK

		it('apiKey without parameters', async () => {
			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', masterApiKey);

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('InfoIncomplete');

		});//OK

		it('apiKey without appCode', async () => {
			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', masterApiKey)
			.send({ "title":"Default" });

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('InfoIncomplete');

		});//OK

		it('apiKey without title', async () => {
			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', masterApiKey)
			.send({ "appCode":"TestApp" });

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('InfoIncomplete');

		});//OK

		it('apiKey without emisor invalid', async () => {
			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', masterApiKey)
			.send({ "appCode":"TestAppXX", "title":"Default" });

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('EmisorDoNotExist');

		});//OK

		it('apiKey with right data', async () => {

			response = await request(app).post(prefix+'/emisor/apikey')
			.set('X-API-KEY', masterApiKey)
			.send(apiKeyRequest);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
			expect(response.body.resultSet).toBeDefined();
			expect(response.body.resultSet.key).toBeDefined();
			expect(response.body.message).toBeDefined();
			expect(response.body.message).toBe('ok');

			apiKey = response.body.resultSet.key;


		});//OK

		it('mail/enqueue without apikey', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.send(mail);

			expect(response.status).toBe(401);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('ApiKeyRequired');
			
		});//OK

		it('mail/enqueue with invalid apikey', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', 'XXXX')
			.send(mail);

			expect(response.status).toBe(401);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('ApiKeyInvalid');
			
		});//OK

		it('mail/enqueue without parameters', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey);

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('ToRequired');

		});//OK

		it('mail/enqueue without to', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey)
			.send({
				"from":"aroldf@gmail.com",
				"subject":"Testing mail at:"+date,
				"text":"Mensaje desde el framework de prueba jest",
			 });

			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('ToRequired');

		});//OK

		it('mail/enqueue without from', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey)
			.send({
				"to":"gerencia@disarrollo.com", 
				"subject":"Testing mail at:"+date,
				"text":"Mensaje desde el framework de prueba jest",
			 });
			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('FromRequired');

		});//OK

		it('mail/enqueue without subject', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey)
			.send({
				"to":"gerencia@disarrollo.com", 
				"from":"aroldf@gmail.com",
				"text":"Mensaje desde el framework de prueba jest",
			 });
			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('SubjectRequired');

		});//OK

		it('mail/enqueue without text', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey)
			.send({
				"to":"gerencia@disarrollo.com", 
				"from":"aroldf@gmail.com",
				"subject":"Testing mail at:"+date,
				
			 });
			expect(response.status).toBe(400);
			expect(response.body.message).toBeDefined();
			expect(response.body.errorCode).toBe('TextRequired');

		});//OK

		it('mail/enqueue with right data', async () => {

			response = await request(app).post(prefix+'/mail/enqueue')
			.set('X-API-KEY', apiKey)
			.send(mail);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
			
			expect(response.body.message).toBeDefined();
			expect(response.body.message).toBe('ok');

		});//OK



	});

});
