
const express = require("express");
const router = express.Router();

const mailController = require('../controllers/mailController');

/*
*  	Status
*/

router.post('/mail/enqueue',  (req, res) => mailController.enqueue(req, res));

module.exports = router;
