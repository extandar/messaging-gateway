require('dotenv').config()
const package_json = require('./package.json')
const app = require('./app');
const routes = require('./routes/core.routes');
const routesCrud = require('./routes/crud.routes');
const db = require('./db.js');
const prefix = process.env.API_PREFIX ? `/api/${ process.env.API_PREFIX }` : '/api';
const SERVICE_PORT = process.env.SERVICE_PORT || 8080;
const DAEMON_DELAY_TIME = process.env.DAEMON_DELAY_TIME || 60000;

const MailQueueService = require('./services/mailQueueService');

db(async client => {
  console.log("Database connected.");

  routes(app, client);
  routesCrud(app, client);

  app.use((req, res, next) => {
      res.status(404).send('Not Found');
  });

  //Init deamons
  //Mailer
  setInterval(async () => {
    await MailQueueService.processQueue();

  }, DAEMON_DELAY_TIME);


}).catch(e => {
  console.error(e)
  app.route('/').get((req, res) => {
      res.status(503).send("Database doesn't available");
  });
});

app.listen(SERVICE_PORT, () =>
  console.log(`${package_json.name} listening on port ${SERVICE_PORT}!`),
);