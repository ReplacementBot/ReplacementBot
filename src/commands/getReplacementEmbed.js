const ReplacementEmbed = require('../util/replacementsEmbed');

module.exports = {
	name: 'embed',
	description: 'get replacement embed',
	async execute(message, args)
	{
		message.channel.send(await ReplacementEmbed.generateEmbed(3, false));
	},
};