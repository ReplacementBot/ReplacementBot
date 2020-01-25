const ReplacementsManager = require('../managers/replacementsManager');

module.exports = {
	name: 'embed',
	description: 'Get replacements for today in form of embed',
	execute(message, args)
	{
		ReplacementsManager.getReplacementsEmbed(1).then((replacementsEmbed) =>
		{
			message.channel.send(replacementsEmbed);
		});
	},
};