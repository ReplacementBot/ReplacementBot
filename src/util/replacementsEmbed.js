const ReplacementScrapper = require('./replacementsScrapper');
const Discord = require('discord.js');

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
module.exports = {
	generateEmbed: async function(daysCount, staticEmbedFooter)
	{
		const embed = new Discord.RichEmbed()
			.setColor('DARK_VIVID_PINK')
			.setTitle('Replacements for class ' + global.config.get('class'))
			.setThumbnail('https://cdn.pixabay.com/photo/2019/08/11/18/50/icon-4399684_960_720.png');

		const footerDate = new Date();
		embed.setFooter((
			staticEmbedFooter ? 'Updated on: ' : 'Generated on: ')
			+ daysOfWeek[footerDate.getDay()] + ' '
			+ (footerDate.getHours() < 10 ? '0' : '') + footerDate.getHours() + ':'
			+ (footerDate.getMinutes() < 10 ? '0' : '') + footerDate.getMinutes(),
		);
		for (let daysIndex = 0; daysIndex < daysCount; daysIndex++)
		{
			const date = new Date();

			date.setDate(date.getDate() + daysIndex);
			await ReplacementScrapper.getReplacements(date)
				.then(function(replacements)
				{
					let result = '';
					for (let replacementsIndex = 0; replacementsIndex < replacements.length; replacementsIndex++)
					{
						if(replacementsIndex > 0)
						{
							result += '\n';
						}
						result += replacements[replacementsIndex].toString();
					}
					if(result == '')
					{
						result = ':x: No replacements for this class on this day';
					}
					embed.addField('Replacements for ' + daysOfWeek[date.getDay()], result);
				})
				.catch(function(error)
				{
					if(error == 404)
					{
						embed.addField('Replacements for ' + daysOfWeek[date.getDay()], ':grey_question: *Replacements not uploaded yet*');
					}
					else
					{
						embed.addField('[ERROR] Replacements for ' + daysOfWeek[date.getDay()], 'An error ocurred, Code: ' + error);
					}
				});
		}
		return embed;
	},
	isEmbedUpdateNeeded: function(embedA, embedB)
	{
		for (let index = 0; index < embedA.fields.length; index++)
		{
			if(embedA.fields[index].name != embedB.fields[index].name) return false;
			if(embedA.fields[index].value != embedB.fields[index].value) return false;
		}

		if(embedA.author == embedB.author &&
			embedA.color == embedB.color &&
			embedA.description == embedB.description &&
			embedA.title == embedB.title)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
};