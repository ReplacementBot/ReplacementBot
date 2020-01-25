const ReplacementsManager = require('../managers/replacementsManager');

module.exports = {
	name: 'update',
	description: 'update replacement channels',
	ownerOnly: true,
	execute(message, args)
	{
		ReplacementsManager.updateReplacementChannels(false)
			.then(function()
			{
				message.reply('Command Executed Successfully');
			})
			.catch(function(error)
			{
				message.reply(error);
			});
	},
};