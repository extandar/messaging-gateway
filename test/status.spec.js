const request = require('supertest');
const app = require ('../app');
const prefix = `/api/${ process.env.API_PREFIX }`;
const routes = require('../routes/core.routes');
const routesCrud = require('../routes/crud.routes');

describe('Test status controller', () => {

	beforeAll(async () => {

		routes(app, null);
		routesCrud(app, null);
        
    });

	describe('GET /ping', () => {
		
		it('route ping', async () => {
			let response = await request(app).get(prefix+'/ping');
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});


	});

});
