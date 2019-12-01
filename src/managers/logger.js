const chalk = require('chalk');
module.exports = {
	fatalAndCrash(message, exitCode)
	{
		if(exitCode == undefined)
		{
			exitCode = 5;
		}
		this.fatal(message);
		process.exit(exitCode);
	},
	fatal: function(message)
	{
		console.log(chalk.bold.red('[FATAL ERROR] ') + message);
	},
	error: function(message)
	{
		console.log(chalk.bold.red('[ERROR] ') + message);
	},
	warn: function(message)
	{
		console.log(chalk.bold.yellow('[WARN] ') + message);
	},
	info: function(message)
	{
		console.log(chalk.bold.white('[INFO] ') + message);
	},
};