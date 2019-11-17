const Discord = require('discord.js');
const Launcher = require('./util/launcher');
const Logger = require('./util/logger');
const Config = require('./classes/config');
const Schedule = require('node-schedule');

const ReplacementsChannelUpdate = require('./util/replacementsChannelUpdate');
const bot = new Discord.Client();

// CONFIG INITIALIZATION CONFIGURATION
const configSource = Config.ConfigSources.AUTO;
const configArgs = undefined;

function main()
{
	Logger.info('Initialling ReplacementBot...');
	initializeConfig();
	Launcher.launchBot(bot)
		.then(botReady)
		.catch((error) => Logger.fatal('Failed to launch ReplacementBot ' + error.message));
}
function initializeScheduledJobs()
{
	const updateAllChannelsJob = async function()
	{
		Logger.info('Running embed update...');
		await ReplacementsChannelUpdate.updateAllChannels(bot, true)
			.then(function()
			{
				Logger.info('Successfully updated all embeds');
			})
			.catch(function(error)
			{
				Logger.error('Failed to update embeds ' + error);
			});
	};
	Schedule.scheduleJob(global.config.get('intervals.replacementsChannelsUpdate'), updateAllChannelsJob);
}
function initializeConfig()
{
	try
	{
		global.config = new Config(configSource, configArgs);
	}
	catch (error)
	{
		Logger.fatal('Failed to load config; ' + error.message);
		process.exit(5);
	}
}
function botReady()
{
	Logger.info('ReplacementBot Ready');
	initializeScheduledJobs();
}

bot.on('message', message =>
{
	if (!message.content.startsWith(global.config.get('prefix')) || message.author.bot) return;

	const args = message.content.slice(global.config.get('prefix').length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	if (!bot.commands.has(commandName)) return;

	const command = bot.commands.get(commandName);
	if(command.ownerOnly && !global.config.get('botOwners').includes(message.author.id))
	{
		message.reply('You are not my owner.');
		return;
	}
	try
	{
		command.execute(message, args);
	}
	catch (error)
	{
		message.reply('Error: ' + error.message);
	}

});

main();

