import TestUtilities from './util';
import ReplacementBot from '../../src/replacementBot';
import { TextChannel, MessageCollector } from 'discord.js';
import { SystemTestsManager } from './systemTestsManager';

export class SystemTest
{
	constructor(command: string, expectedResponse: string, doneCallback: jest.DoneCallback)
	{
		if(TestUtilities.getRunType().isDry())
		{
			doneCallback();
		}
		else
		{
			const manager = this.getManager();

			manager.setupClient()
				.catch(doneCallback.fail)
				.then((client: ReplacementBot) =>
				{
					manager.getTestChannel().then((channel: TextChannel) =>
					{
						channel.send(TestUtilities.commandPrefix + command);
						const collector = new MessageCollector(channel, m => m.author.id === client.user.id);
						collector.on('collect', async message =>
						{
							if(message.content == expectedResponse)
							{
								collector.stop();
								client.stop().then(doneCallback);
							}
						});
					});
				});
		}
	}

	private getManager(): SystemTestsManager
	{
		if(!global._TEST_MANAGER_)
		{
			global._TEST_MANAGER_ = new SystemTestsManager();
		}
		return global._TEST_MANAGER_;
	}
}

declare global {
	namespace NodeJS {
		interface Global {
		_TEST_MANAGER_: SystemTestsManager;
		}
	}
}
