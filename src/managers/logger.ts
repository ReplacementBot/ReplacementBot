import chalk from 'chalk';
import figlet from 'figlet';
import MiscHelpers from '../util/miscHelpers';

export default class Logger
{
	public static fatalAndCrash(message: string, exitCode?: number): void
	{
		if(exitCode == undefined)
		{
			exitCode = 5;
		}
		this.fatal(message);
		if(MiscHelpers.isRunningInTest())
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
		console.log(chalk.bold.red('[FATAL ERROR] ') + chalk.redBright(message));
	}
	public static error(message: string): void
	{
		console.log(chalk.bold.red('[ERROR] ') + chalk.redBright(message));
	}
	public static warn(message: string): void
	{
		console.log(chalk.bold.yellow('[WARN] ') + chalk.yellowBright(message));
	}
	public static info(message: string): void
	{
		console.log(chalk.bold.white('[INFO] ') + message);
	}
	public static printLogo(): void
	{
		console.log();
		console.log(chalk.magenta(figlet.textSync('Replacement Bot')));
		console.log();
	}
}
