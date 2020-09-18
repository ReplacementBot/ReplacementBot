import chalk from 'chalk';
import figlet from 'figlet';
import TestUtilities from '../../tests/util';

export default class Logger
{
	public static critical(source: string, message: string, error?: Error): void
	{
		message += 'Process has been terminated because of critical error';
		if(this.getHelpfulError(message) !== '')
		{
			message += chalk.green(chalk.bold('That is Known Error: ') + this.getHelpfulError(message));
		}
		if(TestUtilities.isRunningInTest())
		{
			throw new Error('Critical Error: ' + message);
		}
		this.log('CRITICAL', source, message, error);
		process.exit(1);
	}

	public static error(source: string, message: string, error?: Error): void
	{
		this.log('ERROR', source, message, error);
	}

	public static warn(source: string, message: string, error?: Error): void
	{
		this.log('WARN', source, message, error);
	}

	public static info(source: string, message: string, error?: Error): void
	{
		this.log('INFO', source, message, error);
	}

	public static printLogo(): void
	{
		console.log(chalk.magenta(figlet.textSync('Replacement Bot')));
		console.log();
	}

	private static log(severity: 'CRITICAL' | 'ERROR' | 'WARN' | 'INFO', source: string, message: string, error?: Error): void
	{
		const color = this.getColor(severity);
		console.log(color.bold(`[${severity}] `) + color(`${source} - ${message}${this.formatError(error)}`));
	}

	private static getColor(severity: 'CRITICAL' | 'ERROR' | 'WARN' | 'INFO'): chalk.Chalk
	{
		switch(severity)
		{
		case 'CRITICAL':
		case 'ERROR':
			return chalk.red;
		case 'WARN':
			return chalk.yellow;
		case 'INFO':
		default:
			return chalk.white;
		}
	}

	private static formatError(error: Error): string
	{
		if(error != null)
		{
			const stack = error.stack.replace(error.name + ': ' + error.message + '\n', '');
			return '\r\n' + chalk.bold(error.name) + ': ' + error.message + '\r\n' + chalk.gray(stack);
		}
		else
		{
			return '';
		}
	}

	private static getHelpfulError(error: string): string
	{
		if(error.includes('REPLACEMENT_BOT_TOKEN is not provided'))
		{
			return 'You are missing bot token! https://replacementbot.github.io/docs/bot_token';
		}
		else if(error.includes('A command with the name/alias') && error.includes('already registered.'))
		{
			return 'Try to delete build folder and rebuild (Windows: rmdir build /s && npm run build)';
		}
		else
		{
			return '';
		}
	}
}
