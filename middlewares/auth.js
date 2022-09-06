const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const masterKey = process.env.MASTER_KEY;
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

verify = (req, res, next) => {

    const lang = req.language;

    let apiKey = req.header('X-API-KEY');

    if (!apiKey) {
      let err = new HandledHtmlError('ApiKeyRequired', lang);
      return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
    }

    jwt.verify(apiKey, secret, (err, decoded) => {

      if (err) {

        if( err.name == 'TokenExpiredError' ){
          err = new HandledHtmlError('ApiKeyExpired', lang);
          return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
        }else{
          err = new HandledHtmlError('ApiKeyInvalid', lang, err);
          LogService.error(err.message, err.errorCode, req, err);
          return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
          
        }
        
      }

      req.emisorId = decoded.id;
      req.appCode = decoded.appCode;
      next();

    });

};

const auth = {
  verify
};

module.exports = auth;

