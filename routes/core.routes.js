const statusController = require('../controllers/statusController');
const emisorController = require('../controllers/emisorController');
const mailController = require('../controllers/mailController');


const prefix = `/api/${ process.env.API_PREFIX }`;

const { auth, master, language } = require("../middlewares");

module.exports = function (app, db) {


	app.use(language.checkLanguage);

	/*
  	*  	Status
  	*/

  	app.get(prefix + '/ping', (req, res) => statusController.ping(req, res));


  	/*
  	*	Generate apiKey
  	*/

  	app.post(prefix+'/emisor/apikey', master.verify, (req, res) => emisorController.apiKey(req, res));


  	/*
  	*	Enqueue an email
  	*/

  	app.post(prefix+'/mail/enqueue', auth.verify, (req, res) => mailController.enqueue(req, res));

}