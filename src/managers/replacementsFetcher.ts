// const VulcanFetcher = require('../replacements/vulcanFetcher');
// const ReplacementsEmbed = require('../replacements/replacementsEmbed');
// const ReplacementsHelper = require('../helpers/replacementsHelper');

// function getReplacementsEmbed(daysCount)
// {
// 	return new Promise((resolve, reject) =>
// 	{
// 		const vulcanFetcher = new VulcanFetcher();
// 		vulcanFetcher.fetchMultipleDays(ReplacementsHelper.getDaysFetchingArray(daysCount))
// 			.then((data) =>
// 			{
// 				resolve(new ReplacementsEmbed(data, true));
// 			})
// 			.catch((error) => reject(error));
// 	});
// }
// function updateReplacementChannels(isUpdateScheduled)
// {
// 	return new Promise((resolve, reject) =>
// 	{
// 		global.config.get('replacementsChannels').forEach(async function(configElement)
// 		{
// 			const channel = global.bot.guilds.get(configElement.guild).channels.get(configElement.channel);
// 			channel.fetchMessages().then(async function(messages)
// 			{
// 				const botMessages = messages.filter(msg => msg.author.id == global.bot.user.id);
// 				const isChannelEmpty = messages.last() == undefined;

// 				getReplacementsEmbed(3).then((newEmbed) =>
// 				{
// 					if(!isUpdateScheduled)
// 					{
// 						newEmbed.footer.text += ' - [MANUAL]';
// 					}
// 					if(isChannelEmpty || !ReplacementsEmbed.isEmbedUpdateNeeded(botMessages.last().embeds[0], newEmbed))
// 					{
// 						channel.bulkDelete(botMessages);
// 						channel.send(newEmbed);
// 						resolve();
// 					}
// 					else
// 					{
// 						botMessages.last().edit(newEmbed);
// 						resolve();
// 					}
// 				});
// 			});
// 		});
// 	});
// }

// this.getReplacementsEmbed = getReplacementsEmbed;
// this.updateReplacementChannels = updateReplacementChannels;