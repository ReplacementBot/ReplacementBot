import { CronJob, CronJobParameters } from 'cron';
import Logger from './logger';

export class ScheduledJob extends CronJob
{
	private jobFunction: () => Promise<void | string>;
	private name: string;

	constructor(jobTime: string, name: string, jobFunction: () => Promise<void | string>, start = true)
	{
		const options: CronJobParameters = {
			cronTime: jobTime,
			onTick: undefined,
		};
		super(options);
		this.jobFunction = jobFunction;
		this.name = name;
		this.addCallback(this.onTick);

		if(start) this.start();
		this.onTick();
	}

	private async onTick(): Promise<void>
	{
		try
		{
			await this.jobFunction()
				.then((promiseResult: void | string) =>
				{
					Logger.info(`Successfully executed '${this.name}' job ` + (promiseResult ? `(${promiseResult})` : ''));
				})
				.catch((error: void | string) =>
				{
					if(error == undefined)
					{
						error = 'No error provided';
					}
					Logger.error(`Job failed "${this.name}" reason: ` + error);

				});
		}
		catch (error)
		{
			Logger.error(`System encountered error while executing "${this.name}" Job: ` + error);
		}
	}

	public fire(): Promise<void>
	{
		return this.onTick();
	}
}

export default class ScheduleManager
{
	private jobs: ScheduledJob[] = [];

	public addJob(newJob: ScheduledJob): number
	{
		return this.jobs.push(newJob);
	}
	public getJobs(): ScheduledJob[]
	{
		return this.jobs;
	}
}
