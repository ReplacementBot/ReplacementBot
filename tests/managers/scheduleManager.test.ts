import Logger from '../../src/managers/logger';
import ScheduleManager, { ScheduledJob } from '../../src/managers/scheduleManager';
describe('ScheduleManager', () =>
{
	describe('ScheduledJob', () =>
	{
		test('should be called on #fire', async () =>
		{
			Logger.info = jest.fn();
			const job = await new ScheduledJob('* * * * *', 'Test', async () =>
			{
				Promise.resolve();
			}, false).fire();
			expect(Logger.info).toHaveBeenCalledWith('Successfully executed \'Test\' job');
		});

		test('should catch errors', () =>
		{
			Logger.error = jest.fn();
			new ScheduledJob('* * * * *', 'Test', () =>
			{
				throw Error('Test');
			}, false).fire();
			expect(Logger.error).toHaveBeenCalledWith('System encountered error while executing "Test" Job: Error: Test');
		});

		test('should catch rejections', async () =>
		{
			Logger.error = jest.fn();
			await new ScheduledJob('* * * * *', 'Test', () =>
			{
				return Promise.reject(new Error('Test'));
			}, false).fire();
			expect(Logger.error).toHaveBeenCalledWith('Job failed "Test" reason: Test');
		});

		test('#nextExecution', () =>
		{
			const job = new ScheduledJob('* * * * *', 'Test', () =>
			{
				return Promise.resolve();
			}, false);
			expect(job.nextExecution() === 'in a minute' || job.nextExecution() === 'in a few seconds').toBeTruthy();
		});
	});
	describe('ScheduleManager', () =>
	{
		test('should add jobs and list jobs', () =>
		{
			const job = new ScheduledJob('* * * * *', 'Test', () =>
			{
				return Promise.resolve();
			}, false);
			const manager = new ScheduleManager();
			manager.addJob(job);
			expect(manager.getJobs()[0].getName()).toBe('Test');
		});

		test('should get job by name', () =>
		{
			const job = new ScheduledJob('* * * * *', 'Test', () =>
			{
				return Promise.resolve();
			}, false);
			const manager = new ScheduleManager();
			manager.addJob(job);
			expect(manager.getJobByName('Test').getName()).toBe('Test');
		});
	});
});
