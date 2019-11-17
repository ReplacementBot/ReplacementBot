const ReplacementScrapper = require('../util/replacementsScrapper');

module.exports = {
	name: 'fetch',
	description: 'fetch replacement for provided date',
	async execute(message, args)
	{
		const date = new Date(args[0], args[1] - 1, args[2]);
		await ReplacementScrapper.getReplacements(date)
			.catch(function(error)
			{
				message.reply(error);
			})
			.then(function(replacements)
			{
				let result = '';
				for(const replacement of replacements)
				{
					result += replacement.toString() + '\n';
				}
				if(result == '')
				{
					result = 'No replacements for this day';
				}
				message.channel.send(result);
			});
	},
};