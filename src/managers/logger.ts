import chalk from 'chalk';
import figlet from 'figlet';
import Helpers from '../util/helpers';

export default class Logger
{
	private static muted = false;

	public static fatalAndCrash(message: string, exitCode?: number): void
	{
		if(exitCode == undefined)
		{
			exitCode = 5;
		}
		this.fatal(message);
		if(Helpers.isRunningInTest())
		{
			throw Error(message);
		}
		else
		{
			process.exit(exitCode);
		}
	}
	public static fatal(message: string): void
	{
		if(Logger.muted) return;
		console.log(chalk.bold.red('[FATAL ERROR] ') + chalk.redBright(message));
	}
	public static error(message: string): void
	{
		if(Logger.muted) return;
		console.log(chalk.bold.red('[ERROR] ') + chalk.redBright(message));
	}
	public static warn(message: string): void
	{
		if(Logger.muted) return;
		console.log(chalk.bold.yellow('[WARN] ') + chalk.yellowBright(message));
	}
	public static info(message: string): void
	{
		if(Logger.muted) return;
		console.log(chalk.bold.white('[INFO] ') + message);
	}
	public static printLogo(): void
	{
		if(Logger.muted) return;
		console.log();
		console.log(chalk.magenta(figlet.textSync('Replacement Bot')));
		console.log();
	}

	public static mute(): void
	{
		console.log(chalk.green('Logger has been muted'));
		Logger.muted = true;
	}
}
