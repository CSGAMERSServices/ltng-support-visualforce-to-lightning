/**
 * Utility methods for working with canvas.
 * @author Paul Roth <proth@salesforce.com>
 **/

//-- cryptography library
var CryptoJS = require('crypto-js');

//-- used to access canvas multi-part body signatures
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();


/**
 * Determines the signed request for a request.
 * @param req (Request)
 * @return (String)
 **/
function getSignedRequest(req){
	var result = (process.env.EX_SIGNED_REQUEST || 'bad.signed_request');

	//-- always use the request sent by body if one was sent though.
	if (req.body && req.body.signed_request){
		console.log('req.body');
		result = req.body.signed_request;
	} else{
		console.log('req.body not found');
	}

	return (result);
}

/**
 * Determines the shared secret
 * @visibility - private
 * @return (String)
 */
function getSharedSecret(){
	return (process.env.CONSUMER_SECRET || 'bad.shared_secret');
}

/**
 * Verifies a request is signed.
 * <p>Defaults the signed request using EX_SIGNED_REQUEST if one was sent though</p>
 *
 * @param req (Request) - assumed multi-part.body.signed_request has been sent
 * @param resp (Response) - response to be returned.
 * @return (Boolean) - if the request was authorized (true) or not(false)
 */
function checkForSignedRequest(req, resp){

	//-- default using the ex signed request if it is present
	var signedRequest = getSignedRequest(req);

	var secret = getSharedSecret();

	var isValidRequest = validateSignedRequest(signedRequest, secret);
	if (!isValidRequest){
		resp.render('pages/error', {
			errMsg: 'not a valid signed request',
		});
	}

	return (isValidRequest);
}


/**
 *  Checks a signed request
 *  @param signedRequest (String)
 *  @param sharedSecret (String)
 *  @return boolean - true if passing false if not
**/
function validateSignedRequest(signedRequest, sharedSecret){

	var matches = false;

	var hashedContext;
	var b64Hash;
	var context;
	var hash;

	try{
		//-- hashed context
		hashedContext = signedRequest.split('.')[0];
		context = signedRequest.split('.')[1];

		//-- sign the hash with the secret
		hash = CryptoJS.HmacSHA256(context, sharedSecret);
		b64Hash = CryptoJS.enc.Base64.stringify(hash);

		matches = (hashedContext === b64Hash);

	} catch (err){
		console.error('error occurred while checking signed request');
		console.error(err);
	}

	if (matches){
		console.log('signed_request matches');
	} else{
		console.error('signed_request DOES NOT MATCH' +
			'\nExpecting:' + b64Hash +
			'\nFound:' + hashedContext
		);
	}

	return (matches);
}

/**
 * Get user context
 * @param signedRequest (String)
 * @param sharedSecret (String)
 * @return UserInfo (Object)
 **/
function getSignedRequestContext(req){
	var results = {};

	var signedRequest = getSignedRequest(req);
	var sharedSecret = getSharedSecret();

	//-- hashed context
	var hashedContext = signedRequest.split('.')[0];
	var context = signedRequest.split('.')[1];

	var words = CryptoJS.enc.Base64.parse(context);
	var textString = CryptoJS.enc.Utf8.stringify(words);

	//-- @TODO: remove
	console.log('signed request context:'); console.log(textString);

	return (JSON.parse(textString));
}

module.exports = {
	getSignedRequest: getSignedRequest,
	checkForSignedRequest: checkForSignedRequest,
	validateSignedRequest: validateSignedRequest,
	getSignedRequestContext: getSignedRequestContext,
};
