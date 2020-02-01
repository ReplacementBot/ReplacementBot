import chalk from 'chalk';
import figlet from 'figlet';

export default class Logger
{
	public static fatalAndCrash(message: string, exitCode?: number): void
	{
		if(exitCode == undefined)
		{
			exitCode = 5;
		}
		this.fatal(message);
		if(this.runningInTest())
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
		console.log(chalk.bold.red('[FATAL ERROR] ') + message);
	}
	public static error(message: string): void
	{
		console.log(chalk.bold.red('[ERROR] ') + message);
	}
	public static warn(message: string): void
	{
		console.log(chalk.bold.yellow('[WARN] ') + message);
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
	private static runningInTest(): boolean
	{
		return process.env.JEST_WORKER_ID !== undefined;
	}
}