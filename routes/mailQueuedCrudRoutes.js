
	
const express = require("express");
const router = express.Router();

const mailQueuedCrudController = require('../controllers/mailQueuedCrudController');

/*
*  	MailQueued Routes
*/

router.get('/', (req, res) => mailQueuedCrudController.getAllMailQueueds(req, res));
router.get('/:id', (req, res) => mailQueuedCrudController.getOneMailQueued(req, res));
router.post('/', (req, res) => mailQueuedCrudController.createOneMailQueued(req, res));
router.patch('/:id', (req, res) => mailQueuedCrudController.updateOneMailQueued(req, res));
router.delete('/:id', (req, res) => mailQueuedCrudController.deleteOneMailQueued(req, res));

module.exports = router;

