'use strict';

/**
 *  Class to manage Heroku nodes.
 *
 *  At present, currently deals with the Formation call.
 *  https://devcenter.heroku.com/articles/platform-api-reference#formation
 *  ex:
 *  curl -n https://api.heroku.com/apps/$APP_ID_OR_NAME/formation/$FORMATION_ID_OR_TYPE \
 *    -H "Accept: application/vnd.heroku+json; version=3"
 *
 *  Additional work may be needed to represent additional calls.
 *
 *  @author Paul Roth <proth@salesforce.com>
 **/

var http = require('http');
var Q = require('q');
var request = require('request');
var _ = require('underscore');

declare module Heroku {
	
	//-- @TODO: cannot seem to get access to this interface under _generateHeaders
	export interface HerokuHeaders {
		method: string;
		Authorization: string;
		Accept?: string;
		'Content-Type'?: string;
	}
}

export default class HerokuDelegate {

	private config:any;

	/** Request Types **/
	static PUT:String = 'PUT';
	static POST:String = 'POST';
	static PATCH:String = 'PATCH';
	static GET:String = 'GET';

	/**
	 *  Generates a web request to heroku to update the number of workers
	 *  for the 't2' process.
	 *  @param workerQuantity (int=0) - number of workers to use
	 *  @return Q.promise
	 *  @visibility public
	 **/
	public updateT2(workerQuantity:number):PromiseLike<string> {
		if (!workerQuantity) {
			workerQuantity = 0;
		}

		var options:Object,
			url:String,
			body:Object;

		url = 'https://api.heroku.com/apps/' + this.config.alerts.heroku.app_name +
			'/formation/' + this.config.alerts.heroku.t2_proc_name;

		body = {
			'quantity': workerQuantity,
			'size': 'standard-1X'
		};

		return ( this._herokuCall(HerokuDelegate.PATCH, url, body) );
	}

	//-- private methods

	/**
	 *  creates a heroku callout header object
	 *  @return (Object)
	 *  @visibility private
	 **/
	public _generateHeaders(requestType:String, config:any):any {
		if (requestType === HerokuDelegate.PUT ||
			requestType === HerokuDelegate.POST ||
			requestType === HerokuDelegate.PATCH
		) {
			//-- do nothing
		} else {
			requestType = HerokuDelegate.GET;
		}
		
		return ({
			'method': requestType,
			'Authorization': 'Bearer ' + this.config.alerts.heroku.api,
			'Accept': 'application/vnd.heroku+json; version=3',
			'Content-Type': 'application/json'
		});
	}

	/**
	 *  Performs the request to heroku
	 *  @param methodType (String) - GET|POST|PATCH , defaults to GET
	 *  @param url (String) - the URL to call
	 *  @param body (Object) - the body to send to the request.
	 *  @return Promise
	 *  @visibility private
	 **/
	private _herokuCall(methodType:String, url:String, body:Object, options?:any):PromiseLike<string> {
		let deferred = Q.defer();

		var headers:Object;

		if (!options) {
			options = {};
		}

		if (methodType === 'POST' ||
			methodType === 'PATCH' ||
			methodType === 'PUT'
		) {
			//-- do nothing
		} else {
			methodType = 'GET';
		}

		headers = this._generateHeaders(methodType, this.config);

		_.defaults(options, {
			'url': url,
			'body': JSON.stringify(body),
			'headers': headers
		});

		var responseHandler = function (error:string, response:any, body:any) {
			if (error) {
				console.log('error occurred during request:');
				console.log(JSON.stringify(error)); //-- @TODO: harden
				deferred.reject(error);
			} else {
				var bodyJSON = JSON.parse(body);

				if (response.statusCode !== 200) {
					console.log('Failed with bad status:' + response.statusCode);
					deferred.reject(bodyJSON);
				} else {
					deferred.resolve(bodyJSON);
				}
			}
		};

		if (HerokuDelegate.POST === methodType) {
			request.post(options, responseHandler);
		} else if (HerokuDelegate.PUT === methodType) {
			request.put(options, responseHandler);
		} else if (HerokuDelegate.PATCH === methodType) {
			request.patch(options, responseHandler);
		} else {
			request.get(options, responseHandler);
		}

		return ( deferred.promise );
	}
	
	public sayHello( name:string ): string {
		console.log( 'Hello ' + name );
		return( 'Hello ' + name );
	}

	constructor(config:any) {
		this.config = config;
	}
}
