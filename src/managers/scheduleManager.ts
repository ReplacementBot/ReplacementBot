import { CronJob, CronJobParameters } from 'cron';
import Logger from './logger';
import ReplacementBot from '../replacementBot';
import Config from './config';

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
	}

	private async onTick(): Promise<void>
	{
		try
		{
			await this.jobFunction()
				.then((promiseResult: void | string) =>
				{
					Logger.info(`Successfully executed '${this.name}' job` + (promiseResult ? ` (${promiseResult})` : ''));
				})
				.catch((error: Error) =>
				{
					if(!error)
					{
						error = new Error('No error provided');
					}
					Logger.error(`Job failed "${this.name}" reason: ` + error.message);

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

	public getName(): string
	{
		return this.name;
	}

	public nextExecution(): string
	{
		return this.nextDate().fromNow();
	}
}

export default class ScheduleManager
{
	private jobs: ScheduledJob[] = [];

	public addJob(newJob: ScheduledJob): ScheduledJob
	{
		const number = this.jobs.push(newJob);
		return this.jobs[number];
	}

	public getJobs(): ScheduledJob[]
	{
		return this.jobs;
	}

	public getJobByName(name: string): ScheduledJob
	{
		return this.jobs.find(x => x.getName() == name);
	}

	public scheduleDefaultJobs(bot: ReplacementBot): ScheduledJob[]
	{
		const jobs: ScheduledJob[] = [];
		jobs.push(this.addJob(new ScheduledJob(
			Config.get('replacementsChannel').updateCron,
			'Update Channels',
			() =>
			{
				return bot.replacementsChannelsManager.updateAllGuilds();
			},
		)));
		return jobs;
	}
}
