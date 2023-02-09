const jwt = require("jsonwebtoken");
const SECRET_KEY_32 = process.env.SECRET_KEY_32;

const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');
const EmisorCrudService = require('../services/emisorCrudService');

verify = (req, res, next) => {

    const lang = req.language;

    let apiKey = req.header('X-API-KEY');

    if (!apiKey) {
      let err = new HandledHtmlError('ApiKeyRequired', lang);
      return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
    }

    jwt.verify(apiKey, SECRET_KEY_32, (err, decoded) => {

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

      EmisorCrudService.getOneEmisor({ _id:decoded.id })
        .then(emisor =>{

          //validate if emisor is active
          if(emisor && emisor.isActive == true){

            //validate if apiKey exist
            let trustApiKey = emisor.apiKeys.find(element=>{
              return element.key == apiKey;
            });

            if(trustApiKey){

              //pass validations
              req.apiKey = trustApiKey;
              req.emisorId = emisor._id;
              next();  

            }else{
              throw new HandledHtmlError("ApiKeyInvalid", lang);
            }
            
          }else{
            throw new HandledHtmlError("EmisorInactive", lang);
          }

        })
        .catch(error=>{
          let err = new HandledHtmlError('SomethingFailed', lang, error);
          LogService.error(err.message, err.errorCode, req, err);
          return res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
        })

    });

};

const auth = {
  verify
};

module.exports = auth;

