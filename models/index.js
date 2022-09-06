'use strict';

const Emisor = require('./emisor');
const MailQueued = require('./mailQueued');
const MailSent = require('./mailSent');

const models = { Emisor, MailQueued, MailSent };

module.exports = models;