/*jslint node:true */
/**
 *  This is the job runner for the worker.
 *  Preferrably everything should be kept in modules.
**/

var _ = require('underscore');

/**
 * Determines the id of the next job to run.
 * (Null for no job)
 * @return String - the job id or null if no job
 **/
function getAJob(){
	console.log('checking for job. sure!');

	//-- run in an atomic manner
	//-- @TODO - check if there is a job
	//-- @TODO - assign myself to the job
	//-- @TODO - query if I own the job I asked for
	//-- @TODO - return null if I didn't get it... :(
	this.jobId = '' + (new Date().getTime());

	return (this.jobId);
}

/**
 * Runs the job
 * @TODO: queuable?
 **/
function runJob(){

	//-- @TODO: use q / promises?

	var msg = '' +
		'\n  _                      _               _  ____  ____   ' +
		'\n | |                    | |             | |/ __ \|  _ \  ' +
		'\n | |     _____   _____  | |_ ___        | | |  | | |_) | ' +
		'\n | |    / _ \ \ / / _ \ | __/ _ \   _   | | |  | |  _ <  ' +
		'\n | |___| (_) \ V /  __/ | || (_) | | |__| | |__| | |_) | ' +
		'\n |______\___/_\_/_\___| _\__\___/   \____/_\____/|____(_)' +
		'\n      | |/ __ \|  _ \  (_)     | |    (_)/ _|            ' +
		'\n      | | |  | | |_) |  _ ___  | |     _| |_ ___         ' +
		'\n  _   | | |  | |  _ <  | / __| | |    | |  _/ _ \        ' +
		'\n | |__| | |__| | |_) | | \__ \ | |____| | ||  __/_       ' +
		'\n  \____/ \____/|____/  |_|___/ |______|_|_| \___(_)      ';
	console.log(msg);

	return;
}

/**
 *  Determines if there is a job to be run.
**/
module.exports = function (){
	this.isRunning = false;
	this.jobId = new Date().getTime();

	this.runJob = runJob;
	this.getAJob = getAJob;

	return (this);
};
