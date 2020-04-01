import chalk from 'chalk';
import { SystemTestsManager } from './systemTestsManager';
import ReplacementBot from '../../src/replacementBot';
import Logger from '../../src/managers/logger';
import TestUtilities from './util';

module.exports = (): Promise<void> =>
{
	Logger.mute();
	return new Promise((resolve, reject) =>
	{
		console.log(chalk.green('Delete test channel'));
		const manager = new SystemTestsManager();
		manager.setupClient(false)
			.catch(reject)
			.then((client: ReplacementBot) =>
			{
				manager.getTestChannel()
					.then((channel) =>
					{
						channel.delete().then(() =>
						{
							manager.clear();
							client.stop().then(() =>
							{
								console.log('\r\n' + TestUtilities.getRunType().toString());
								resolve();
							});
						});
					});
			});
	});
};
