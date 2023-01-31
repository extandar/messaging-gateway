const emisorCrudController = require('../controllers/emisorCrudController');
const mailQueuedCrudController = require('../controllers/mailQueuedCrudController');
const mailSentCrudController = require('../controllers/mailSentCrudController');

const prefix = `/api/${process.env.API_PREFIX}`;
const { auth, master, language } = require('../middlewares');

module.exports = function (app, db) {
	    

	/*
  	*  	Emisor Routes
  	*/

  	app.post(prefix+'/emisors', master.verify, (req, res) => emisorCrudController.viewListEmisor(req, res));
  	app.get(prefix+'/emisor/:id', master.verify, (req, res) => emisorCrudController.viewOneEmisor(req, res));
  	app.post(prefix+'/emisor/create', master.verify, (req, res) => emisorCrudController.createOneEmisor(req, res));
  	app.post(prefix+'/emisor/update', master.verify, (req, res) => emisorCrudController.updateOneEmisor(req, res));
  	app.post(prefix+'/emisor/remove', master.verify, (req, res) => emisorCrudController.removeOneEmisor(req, res));



	/*
  	*  	MailQueued Routes
  	*/

  	app.post(prefix+'/mailQueueds', master.verify, (req, res) => mailQueuedCrudController.viewListMailQueued(req, res));
  	app.get(prefix+'/mailQueued/:id', master.verify, (req, res) => mailQueuedCrudController.viewOneMailQueued(req, res));
  	


	/*
  	*  	MailSent Routes
  	*/

  	app.post(prefix+'/mailSents', master.verify, (req, res) => mailSentCrudController.viewListMailSent(req, res));
  	app.get(prefix+'/mailSent/:id', master.verify, (req, res) => mailSentCrudController.viewOneMailSent(req, res));
  	
}
	    