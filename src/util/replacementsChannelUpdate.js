const Discord = require('discord.js');
const ReplacementsEmbed = require('../util/replacementsEmbed');
module.exports = {
	updateAllChannels: function(bot, isUpdateScheduled)
	{
		return new Promise(function(resolve, reject)
		{
			global.config.get('replacementsChannels').forEach(async function(configElement)
			{
				const guild = await bot.guilds.get(configElement.guild);
				if(guild == undefined)
				{
					reject('Failed to get guild, check config');
					return;
				}
				const channel = guild.channels.get(configElement.channel);
				if(channel == undefined)
				{
					reject('Failed to get channel, check config');
					return;
				}
				channel.fetchMessages().then(async function(messages)
				{
					const botMessages = messages.filter(msg => msg.author.id == bot.user.id);
					const newEmbed = await ReplacementsEmbed.generateEmbed(3, true);
					const isChannelEmpty = messages.last() == undefined;
					if(!isUpdateScheduled)
					{
						newEmbed.footer.text += ' - [MANUAL]';
					}
					// if replacement changed, delete message and send it once again to send notification
					// if not, just edit to update footer
					if(isChannelEmpty || !ReplacementsEmbed.isEmbedUpdateNeeded(messages.last().embeds[0], newEmbed))
					{
						channel.bulkDelete(botMessages);
						channel.send(newEmbed);
						resolve();
					}
					else
					{
						botMessages.last().edit(newEmbed);
						resolve();
					}
				});
			});
		});
	},
};