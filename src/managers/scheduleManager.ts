// const { CronJob, CronTime } = require('cron');
// const Logger = require('./logger');
// const Moment = require('moment');

// const ReplacementsManager = require('./replacementsManager');

// class ScheduleManager
// {
// 	constructor()
// 	{
// 		this.jobs = [];
// 	}
// }

// ScheduleManager.prototype.AddJob = function(job)
// {
// 	this.jobs.push(job);
// };

// ScheduleManager.prototype.scheduleDefaultJobs = function(bot)
// {
// 	this.AddJob(new ScheduledJob('Update Embeds', global.config.get('intervals').replacementsChannelsUpdate, function()
// 	{
// 		return ReplacementsManager.updateAllChannels(true);
// 	}));
// };

// ScheduleManager.prototype.getJobByName = function(name)
// {
// 	return this.jobs.filter(function(job)
// 	{
// 		return job.name == name;
// 	})[0];
// };

// module.exports.ScheduleManager = ScheduleManager;

// class ScheduledJob
// {
// 	constructor(name, interval, job)
// 	{
// 		this.name = name;
// 		this.cornJob = new CronJob(interval, function()
// 		{
// 			job()
// 				.then(Logger.info('CronJob "' + name + '" executed sucesfully'))
// 				.catch((error) => Logger.error('CronJob "' + this.name + '" Failed to execute cause: ' + error));
// 		}, null, true);
// 	}
// }
// ScheduledJob.prototype.getNextExecutionRemaining = function()
// {
// 	return Moment(this.cornJob.nextDates()).fromNow();
// };

// module.exports.ScheduledJob = ScheduledJob;