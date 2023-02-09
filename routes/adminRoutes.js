const express = require("express");
const router = express.Router();

const apiKeyController = require('../controllers/apiKeyController');

/*
*  	Api Keys
*/

router.post('/apikey',  (req, res) => apiKeyController.createApiKey(req, res));

module.exports = router;
