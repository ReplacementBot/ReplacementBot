const fs = require('fs');
const { Collection } = require('discord.js');

class CommandsManager
{
	constructor()
	{
		this.commands = getCommands();
	}
}
CommandsManager.prototype.executeCommand = function(message)
{
	if (!messageContainsPrefix(message)) return;
	const commandArguments = splitMessage(message);
	const commandName = commandArguments.split();
	if(!commandExist(commandName)) return;

	const command = this.commands.get(commandName);
	if(userHaveEnoughPermissions(message, command))
	{
		try
		{
			command.execute(message, commandArguments);
		}
		catch (error)
		{
			message.reply('Command Error: ' + error.message);
		}
	}
	else
	{
		message.reply('Not enough permissions');
	}
};
function getCommands()
{
	const commands = new Collection();
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const command = require(`../commands/${file}`);
		commands.set(command.name, command);
	}
	return commands;
}
function messageContainsPrefix(message)
{
	return message.content.startsWith(global.config.get('prefix'));
}
function splitMessage(message)
{
	return message.content.slice(global.config.get('prefix').length).split(/ +/);
}
function commandExist(commandName)
{
	return this.commands.has(commandName);
}
function userHaveEnoughPermissions(message, command)
{
	if(command.ownerOnly)
	{
		return isUserOwner(message.author);
	}
	else
	{
		return true;
	}
}
function isUserOwner(user)
{
	return global.config.get('botOwners').includes(user.id);
}

module.exports = CommandsManager;
