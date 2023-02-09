
	
const express = require("express");
const router = express.Router();

const emisorCrudController = require('../controllers/emisorCrudController');

/*
*  	Emisor Routes
*/

router.get('/', (req, res) => emisorCrudController.getAllEmisors(req, res));
router.get('/:id', (req, res) => emisorCrudController.getOneEmisor(req, res));
router.post('/', (req, res) => emisorCrudController.createOneEmisor(req, res));
router.patch('/:id', (req, res) => emisorCrudController.updateOneEmisor(req, res));
router.delete('/:id', (req, res) => emisorCrudController.deleteOneEmisor(req, res));

module.exports = router;

