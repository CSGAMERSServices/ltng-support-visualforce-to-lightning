
//-- used to access canvas multi-part body signatures
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//-- used to determine files / paths
var path = require('path');

//-- express
var express = require('express');
var app = express();

//-- used to specify config variables
var config = require('config');

//-- helpers for debugging code
var debugHelpers = require('./local_modules/util/DebugHelpers');

//-- helpers for handling canvas requests
var canvasHelpers = require('./local_modules/util/CanvasHelpers');

//-- required to parse canvas/multi-part requests
//-- always needs to be first.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//-- configure express (using the current directory
app.set('port', (process.env.PORT || config.default.PORT));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//-- page handlers

/**
 * Handler for the initial / page
 * @param req (request)
 * @param resp (Response)
 **/
function handleDefault(req, resp){
	resp.status(config.statusCodes.unauthorized)
		.send(config.statusCodes.unauthorizedText);
}

/**
 *  Handles if the callback page is requested
 *  @param req (request)
 *  @param resp (response)
**/
function handleCallback(req, resp){
	if (!canvasHelpers.checkForSignedRequest(req, resp)){
		return;
	}

	resp.render('pages/callback');
}

/**
 *  Handles if the callback page is requested
 *  @param req (request)
 *  @param resp (response)
**/
function handleCanvasRequest(req, resp){
	if (!canvasHelpers.checkForSignedRequest(req, resp)){
		return;
	}

	var userInfo = canvasHelpers.getSignedRequestContext(req);

	var signedRequest = canvasHelpers.getSignedRequest(req);

	resp.render('pages/canvas', {
		SIGNED_REQUEST: signedRequest,
		CLIENT_ID: process.env.CONSUMER_KEY,
		USERNAME: userInfo.context.user.fullName,
		INSTANCE_URL: userInfo.client.instanceUrl,
		TOKEN: userInfo.client.oauthToken,
		USER_INFO: userInfo,
	});
}

app.get('/', handleDefault);
app.get('/canvas', handleCanvasRequest);
app.post('/canvas', handleCanvasRequest);

//-- deprecated, do not expect users to authorize.
app.get('/callback', handleCallback);

app.listen(app.get('port'), function (){
	console.log('Node app is running on port', app.get('port'));
});

