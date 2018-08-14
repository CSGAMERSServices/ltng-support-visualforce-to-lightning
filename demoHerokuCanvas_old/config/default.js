

module.exports = {
	
	//-- which environment
	"env": "default",
	
	//-- defaults
	"default": {
		"PORT": 5000
	},
	
	//-- worker configurations
	"worker": {
		//-- how many seconds before starting again.
		//-- @TODO: review if this should be a heroku setting.
		"cronSpeed": 2
	},
	
	//-- https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	"statusCodes": {
		"unauthorized": 401,
		"unauthorizedText": "Unauthorized"
	}
};

//-- post processing
module.exports.default.STATUS_CODE = module.exports.statusCodes.unauthorized;
module.exports.default.STATUS_TEXT = module.exports.statusCodes.unauthorizedText;

