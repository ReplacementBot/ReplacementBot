const chalk = require('chalk');
module.exports = {
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