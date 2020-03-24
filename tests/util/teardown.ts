import chalk from 'chalk';
import { SystemTestsManager } from './systemTestsManager';
import ReplacementBot from '../../src/replacementBot';
import Logger from '../../src/managers/logger';

module.exports = () =>
{
	Logger.mute();
	return new Promise((resolve, reject) =>
	{
		console.log(chalk.green('Delete test channel'));
		const manager = new SystemTestsManager();
		manager.setupClient()
			.catch(reject)
			.then((client: ReplacementBot) =>
			{
				manager.getTestChannel()
					.then((channel) =>
					{
						channel.delete().then(() =>
						{
							client.stop().then(resolve);
						});
					});
			});
	});
};
