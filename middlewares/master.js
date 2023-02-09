const jwt = require("jsonwebtoken");

const masterKey = process.env.MASTER_KEY;
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

verify = (req, res, next) => {

    const lang = req.language;

    let apiKey = req.header('X-API-KEY');

    if (!apiKey) {
      let err = new HandledHtmlError('MasterApiKeyRequired', lang);
      return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
    }

    if(apiKey == masterKey){

      next();

    }else{
      let err = new HandledHtmlError('MasterApiKeyInvalid', lang);
      LogService.error(err.message, err.errorCode, req, err);
      return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
    }

};

const master = {
  verify
};

module.exports = master;

