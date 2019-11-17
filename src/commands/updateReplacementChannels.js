const ReplacementsChannelUpdate = require('../util/replacementsChannelUpdate');

module.exports = {
	name: 'update',
	description: 'update replacement channels',
	ownerOnly: true,
	execute(message, args)
	{
		ReplacementsChannelUpdate.updateAllChannels(message.client, false)
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