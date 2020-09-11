const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase); // should be my json file?

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const errorHandlers = require('./api/middleware/errorhandlers');


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('REST API listening on PORT '+port);
});

app.get('/', async(req, res) => {
    res.json({status: 'API is ready to go'});
});

// Connect routes
const loginRoute = require('./api/routes/login');
app.use('/login', loginRoute);
const registerRoute = require('./api/routes/register');
app.use('/register', registerRoute);

const authorization = require('./api/middleware/authorization');
app.use("/secure", authorization);
const profileRoute = require('./api/routes/profile');
app.use('/secure/profile', profileRoute);
const notificationRoute = require('./api/routes/notification');
app.use('/secure/notification', notificationRoute);
const usersRoute = require('./api/routes/users');
app.use('/secure/users', usersRoute);
const settingsRoute = require('./api/routes/settings');
app.use('/secure/settings', settingsRoute);
const tripsRoute = require('./api/routes/trips');
app.use('/secure/trips', tripsRoute);
const imageRoute = require('./api/routes/image');
app.use('/secure/image', imageRoute);

// Handle invalid routes and any thrown errors
app.use(errorHandlers.errorHandling.notFound);
app.use(errorHandlers.errorHandling.handleError);

exports.app = functions.https.onRequest(app);