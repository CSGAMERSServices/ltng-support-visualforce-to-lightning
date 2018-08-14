/*jslint node:true */
/**
 *  This is the worker script.
**/

//-- configuration for the job
var config = require('config');

//-- ability to run the job on a scheduled basis until it dies.
var CronJob = require('cron').CronJob;

//-- promises/utilities
var Q = require('q');
var _ = require('underscore');

//-- runner for the job
var WorkerRunner = require('./local_modules/runners/WorkerRunner');


//-- start the job


//-- @TODO: investigate scope for worker.
var worker = new WorkerRunner();

if (worker.getAJob()){
	console.log('job was found');
	worker.runJob();
}

//-- note: if we do not use named functions, it names are not included in logs/traces
var cronScope = {
	working: false,
	cronJobRunner: function (){
		console.log('job is currently running');

		if (worker.getAJob()){
			//-- do it. within a module.
			console.log('job was found');
			worker.runJob();
		}

		console.log('runner done');
	},
};

cronScope.cronJob = new CronJob({
	//-- run the job every other second
	cronTime: '*/' + config.worker.cronSpeed + ' * * * * *',
	start: true,
	onTick: cronScope,
	timeZone: 'America/Los_Angeles',
});

cronScope.cronJob.start();

