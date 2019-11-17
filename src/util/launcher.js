const Discord = require('discord.js');
const Logger = require('./logger');
const fs = require('fs');
module.exports = {
	launchBot: function(bot)
	{
		return new Promise((resolve, reject) =>
		{
			bot.commands = getCommands();
			bot.login(process.env.REPLACEMENT_BOT_TOKEN)
				.then(async function()
				{
					await verifyOwnersIds(bot);
					resolve(bot);
				})
				.catch((error) => reject(new Error('Failed to login: ' + error.message)));
		});
	},
};

function getCommands()
{
	const commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const command = require(`../commands/${file}`);
		commands.set(command.name, command);
	}
	return commands;
}

async function verifyOwnersIds(bot)
{
	if(!global.config.contains('botOwners') ||
		!Array.isArray(global.config.get('botOwners')) ||
		global.config.get('botOwners').length == 0)
	{
		Logger.warn('No owners specified in config, some commands will be inaccessible');
		return;
	}
	for await(const ownerId of global.config.get('botOwners'))
	{
		await bot.fetchUser(ownerId).catch(function(error)
		{
			Logger.warn('Unknown owner id, check config, id: ' + ownerId + ', error: ' + error.message);
		});
	}
}