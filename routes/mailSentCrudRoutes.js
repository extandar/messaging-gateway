
	
const express = require("express");
const router = express.Router();

const mailSentCrudController = require('../controllers/mailSentCrudController');

/*
*  	MailSent Routes
*/

router.get('/', (req, res) => mailSentCrudController.getAllMailSents(req, res));
router.get('/:id', (req, res) => mailSentCrudController.getOneMailSent(req, res));
router.post('/', (req, res) => mailSentCrudController.createOneMailSent(req, res));
router.patch('/:id', (req, res) => mailSentCrudController.updateOneMailSent(req, res));
router.delete('/:id', (req, res) => mailSentCrudController.deleteOneMailSent(req, res));

module.exports = router;

