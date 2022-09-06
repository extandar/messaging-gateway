const defaultLanguage = process.env.DEFAULT_LANGUAGE || 'en';

checkLanguage = (req, res, next) => {

    req.language = req.body.language || defaultLanguage;
    next();

};

const language = {
  checkLanguage
};

module.exports = language;

