'use strict';

const express = require('express');
const app = express();
const { auth, language, master } = require('./middlewares');
const API_PREFIX = process.env.API_PREFIX ? `/api/${ process.env.API_PREFIX }` : '/api';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(language.checkLanguage);

//PUBLIC
const publicRouter = require("./routes/publicRoutes");

app.use(API_PREFIX + "/", publicRouter);

//CRUD
const emisorCrudRoutes = require("./routes/emisorCrudRoutes");
const mailQueuedCrudRoutes = require("./routes/mailQueuedCrudRoutes");
const mailSentCrudRoutes = require("./routes/mailSentCrudRoutes");

app.use(API_PREFIX + "/emisor", master.verify, emisorCrudRoutes);
app.use(API_PREFIX + "/mailqueued", master.verify, mailQueuedCrudRoutes);
app.use(API_PREFIX + "/mailsent", master.verify, mailSentCrudRoutes);

//ADMIN
const adminRoutes = require("./routes/adminRoutes");

app.use(API_PREFIX + "/admin", master.verify, adminRoutes);

//CORE
const coreRoutes = require("./routes/coreRoutes");

app.use(API_PREFIX + "/core", auth.verify, coreRoutes);

module.exports = app;

