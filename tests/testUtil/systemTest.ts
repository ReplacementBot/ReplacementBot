import TestUtilities from './util';
import ReplacementBot from '../../src/replacementBot';
import { TextChannel, MessageCollector } from 'discord.js';
import { SystemTestsManager } from './systemTestsManager';

export class SystemTest
{
	public static timeout = 15 * 1000;
	public static shouldSkip(): boolean
	{
		return TestUtilities.getRunType().isDry();
	}

	public runTest(command: string, type: SystemTestType): Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			this.setup()
				.catch(reject)
				.then((data: any) =>
				{
					const client = data[0] as ReplacementBot;
					const channel = data[1] as TextChannel;

					if(type == SystemTestType.EXPECT_MESSAGE)
					{
						channel.send(TestUtilities.commandPrefix + command);
						const collector = new MessageCollector(channel, (message) =>
						{
							const validAuthor = message.author.id == client.user.id;
							const validMessage = !message.content.includes(TestUtilities.commandPrefix);
							return validAuthor && validMessage;
						});

						collector.on('collect', message =>
						{
							collector.stop();
							client.stop().then(() =>
							{
								resolve(message.content);
							});
						});
					}
					else if(type == SystemTestType.EXPECT_EDIT)
					{
						channel.send(TestUtilities.commandPrefix + command);
						client.on('messageUpdate', (oldMessage, newMessage) =>
						{
							client.stop().then(() =>
							{
								resolve(newMessage.content);
							});
						});
					}
				});
		});
	}

	private setup(): Promise<[ReplacementBot, TextChannel]>
	{
		return new Promise((resolve, reject) =>
		{
			const manager = this.getManager();
			manager.setupClient()
				.catch(reject)
				.then((client: ReplacementBot) =>
				{
					manager.getTestChannel().then((channel: TextChannel) =>
					{
						resolve([client, channel]);
					});
				});

		});
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

export enum SystemTestType
{
	EXPECT_MESSAGE,
	EXPECT_EDIT
}

declare global {
	namespace NodeJS {
		interface Global {
		_TEST_MANAGER_: SystemTestsManager;
		}
	}
}
