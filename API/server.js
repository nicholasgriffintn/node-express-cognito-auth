const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const typeis = require('type-is');
const chalk = require('chalk');
const CognitoExpress = require("cognito-express");

const app = express();
const fs = require('fs');

app.use(compression())

app.use(cors())

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const errorMap = require('./constants/error');
const serverMap = require('./constants/server');

const authenticatedRoute = express.Router();

app.use("/authenticated", authenticatedRoute);

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
	region: serverMap.AWS_COGNITO_REGION,
	cognitoUserPoolId: serverMap.AWS_COGNITO_USER_POOL_ID,
	tokenUse: serverMap.AWS_COGNITO_TOKEN_USE,
	tokenExpiration: serverMap.AWS_COGNITO_TOKEN_EXPRIATION
});

authenticatedRoute.use(function(req, res, next) {
	let accessTokenFromClient = req.headers.accesstoken;
	if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

	cognitoExpress.validate(accessTokenFromClient, function(err, response) {
		if (err) return res.status(401).send(err);
		res.locals.user = response;
		next();
	});
});

const apiAuthRoute = express.Router();

app.use("/api/auth", apiAuthRoute);

const apiContentRoute = express.Router();

app.use("/api/content", apiContentRoute);

const routes = require('./routes/routes.js')(app, authenticatedRoute, apiAuthRoute, apiContentRoute, serverMap, errorMap, fs, typeis);

const server = app.listen(serverMap.PORT, () => {
    console.log(
      chalk.green.bold(
        `
          Yep this is working 🍺
          App listen on port: ${serverMap.PORT} 🍕
          Env: ${process.env.NODE_ENV} 🦄
        `,
      ),
    );
    console.log('listening on port %s...', server.address().port);
});