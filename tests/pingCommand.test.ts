import ReplacementBot from '../src/replacementBot';
import { ConfigSettings, ConfigSources } from '../src/managers/config';
import TestUtilities from './util';
import { Message, MessageCollector } from 'discord.js';
import WebFetcher from '../src/util/webFetcher';
import Logger from '../src/managers/logger';
declare function fail(error?: any): never;

process.argv.push('--trace-warnings');

describe('Ping Command', () =>
{
	test('should ping bot', async (done) =>
	{
		const bot = new ReplacementBot(TestUtilities.defaultConfigSettings);
		await expect(bot.start()).resolves.toBe(undefined);
		await TestUtilities.setupTestChannel(bot).then(async (channel) =>
		{
			await expect(channel.send(TestUtilities.commandPrefix + 'ping')).resolves.toBeInstanceOf(Message);

			const collector = new MessageCollector(channel, m => m.author.id === bot.user.id);
			collector.on('collect', async message =>
			{
				expect(message.content).toBe('Pinging...');
				collector.stop();
				await expect(channel.delete()).resolves.toEqual(
					expect.objectContaining({
						deleted: true,
					}),
				);
				await expect(bot.stop()).resolves.toBe(undefined);
				done();
			});

		}).catch(fail);
	});
});

