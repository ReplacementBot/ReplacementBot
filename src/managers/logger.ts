import chalk from "chalk";
import figlet from "figlet";

export default class Logger
{
	public static fatalAndCrash(message: string, exitCode?: number)
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
	public static fatal(message: string)
	{
		console.log(chalk.bold.red('[FATAL ERROR] ') + message);
	}
	public static error(message: string)
	{
		console.log(chalk.bold.red('[ERROR] ') + message);
	}
	public static warn(message: string)
	{
		console.log(chalk.bold.yellow('[WARN] ') + message);
	}
	public static info(message: string)
	{
		console.log(chalk.bold.white('[INFO] ') + message);
	}
	public static printLogo()
	{
		console.log();
		console.log(chalk.magenta(figlet.textSync('Replacement Bot')));
		console.log();
	}
	private static runningInTest()
	{
		return process.env.JEST_WORKER_ID !== undefined;
	}
}