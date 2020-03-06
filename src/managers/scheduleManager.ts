import { CronJob, CronTime, CronJobParameters, job } from 'cron';
import { Moment } from 'moment';
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
					if(promiseResult != undefined)
					{
						Logger.warn('ScheduledJob shouldn\'t return anything when they are successfully executed, job returned string: ' + promiseResult);
					}
					Logger.info(`Successfully executed ${this.name} job`);
				})
				.catch((error: void | string) =>
				{
					if(error == undefined)
					{
						error = 'No error provide';
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
	jobs: ScheduledJob[] = [];

	public addJob(newJob: ScheduledJob): number
	{
		return this.jobs.push(newJob);
	}
}
