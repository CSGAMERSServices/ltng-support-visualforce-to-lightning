/**
 * helper scripts for debugging things
 * @author Paul Roth <proth@salesforce.com>
 **/

/**
 * prints an object out to console.
 * @param obj (Object)
 * @param message (String)
 **/
function prettyTrace(obj, message){
	if (obj){
		console.log('starting review of:' + message);
		for (var key in obj){
			console.log(message + '[' + key + ']:' + (typeof obj[key]) + '=' + obj[key]);
		}

		console.log('ending review of:' + message);
	} else{
		console.log('obj: ' + message + ' - was not sent');
	}
}

/**
 * Dumps everything from a request
 * @param req (Request)
 **/
function dumpRequest(req){
	prettyTrace(req.params, 'req.params');
	prettyTrace(req.query, 'req.query');
	prettyTrace(req.headers, 'req.headers');
	prettyTrace(req.body, 'req.body');
	prettyTrace(process.env, 'process.env');
}

module.exports = {
	prettyTrace: prettyTrace,
	dumpRequest: dumpRequest,
};
