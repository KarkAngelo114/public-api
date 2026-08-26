// This is the main application entry point
// Here you can register your routes and functions to call at start up (using node App or node expressiveCLI --serve)

// Express default imports
require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const app = express();
const path = require('path');

// Express default Configs
require('./applications/loggers').setThreshold(1000 * 60 * 60); // you can configure this
let port = Number(process.env.PORT) || 3001;
let server_host = Number(process.env.SERVERHOST);
let workerRegistration = require('./applications/server-workers/registerWorker');
let createSession = require('./sessions/session-noSQL');
workerRegistration();

app.set('trust-proxy', 1);
app.use(cookie());
app.use(createSession);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/views', express.static(path.join(__dirname, 'views')));




// ========= register routes here ===========

// Example:
// let UserRoutes = require('./routes/UserRoutes');
//
// app.use(UserRoutes);
// ensure that when registering routes, you use "app.use(myRoutes);"

// ensure you applied appropriate CORS middlewares before your routes to avoid getting CORS error
// you may also modify the "allowedCors" module according to your preferences
/**
    example usage:
    const { allowedCors, publicCors } = require('./middlewares/cors');

    * if both route1 and route2 are already routers*
    app.use(allowedCors, route1);
    app.use(publicCors, route2);

    * otherwise if applying to specific path *
    app.use('/api/endpoint1',allowedCors, route1);
    app.use('/api/endpoint2'publicCors, route2);

 */
const { publicCors } = require('./middlewares/cors');
let infernceRoute = require('./routes/inference-route');

// We use publicCors
app.use("/public-api/v1", publicCors, infernceRoute);




app.listen(port, server_host, () => {
    console.log(`[/]------- Server is listening on port ${port}`)
})