const { CronJob, CronTime } = require('cron');
const Logger = require('./logger');

const ReplacementsChannelUpdate = require('../util/replacementsChannelUpdate');

class ScheduleManager
{ }
ScheduleManager.prototype.scheduleDefaultJobs = function(bot)
{
	this.scheduleJob(global.config.get('intervals').replacementsChannelsUpdate, function()
	{
		return ReplacementsChannelUpdate.updateAllChannels(bot, true);
	});
};
ScheduleManager.prototype.scheduleJob = function(interval, job)
{
	new CronJob(interval, function()
	{
		executeCornJobWithErrorHandler(job);
	}, null, true, 'America/Los_Angeles');
};
function executeCornJobWithErrorHandler(job)
{
	job()
		.then(Logger.info('Embeds update complete'))
		.catch((error) => Logger.error('Failed to update embeds ' + error));
}

module.exports = ScheduleManager;