import chalk from 'chalk';
import figlet from 'figlet';
import TestUtilities from '../../tests/util';

export default class Logger
{
	public static critical(message: string): void
	{
		console.log(chalk.bold.red('[CRITICAL] ') + chalk.red(message));
		console.log(chalk.red('Process has been terminated because of critical error'));
		console.log(chalk.red('You can report issues at: https://github.com/MrBartusek/ReplacementBot/issues'));
		if(this.getHelpfulError(message) !== '')
		{
			console.log(chalk.green('TIP: ' + this.getHelpfulError(message)));
		}
		if(TestUtilities.isRunningInTest())
		{
			throw new Error('Critical Error: ' + message);
		}
		process.exit(5);
	}

	public static error(message: string): void
	{
		console.log(chalk.bold.red('[ERROR] ') + chalk.red(message));
	}

	public static warn(message: string): void
	{
		console.log(chalk.bold.yellow('[WARN] ') + chalk.yellow(message));
	}

	public static info(message: string): void
	{
		console.log(chalk.bold.white('[INFO] ') + chalk.white(message));
	}

	public static printLogo(): void
	{
		console.log();
		console.log(chalk.magenta(figlet.textSync('Replacement Bot')));
		console.log();
	}

	private static getHelpfulError(error: string): string
	{
		if(error.includes('REPLACEMENT_BOT_TOKEN is not provided'))
		{
			return 'You are missing bot token, please read "Configure Bot" article on wiki!';
		}
		else
		{
			return '';
		}
	}
}
