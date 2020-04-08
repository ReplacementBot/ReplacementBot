import ReplacementBot from '../../src/replacementBot';
import { TextChannel, ChannelData } from 'discord.js';
import TestUtilities from './util';
import fs from 'fs';
import path from 'path';
import os from 'os';

export class SystemTestsManager
{
    private DIR = path.join(os.tmpdir(), 'replacementbot_test');

	private client: ReplacementBot;
	private channel: TextChannel;

	public setupClient(): Promise<ReplacementBot>
	{
		return new Promise((resolve, reject) =>
		{
			process.env.REPLACEMENT_BOT_CONFIG = `{ "prefix":"${TestUtilities.commandPrefix}" }`;
			const client = new ReplacementBot();
			client.start()
				.catch(reject)
				.then(() =>
				{
					this.client = client;
					resolve(client);
				});
		});
	}

	public getTestChannel(): Promise<TextChannel>
	{
		return new Promise((resolve, reject) =>
		{
			if(!this.client || !this.client.ready) return Promise.reject('Client is not ready');

			if(this.channel)
			{
				resolve(this.channel);
			}
			else if(fs.existsSync(path.join(this.DIR, 'replacementBotChannelId')))
			{
				const id = fs.readFileSync(path.join(this.DIR, 'replacementBotChannelId')).toString();
				const guild = this.client.guilds.find((x) => x.id == TestUtilities.getTestGuildId());
				const channel = guild.channels.find((x) => x.id == id) as TextChannel;

				this.channel = channel;
				resolve(channel);
			}
			else
			{
				this.createTestChannel()
					.catch(reject)
					.then((newChannel: TextChannel) =>
					{
						this.channel = newChannel;
						fs.mkdirSync(this.DIR);
						fs.writeFileSync(path.join(this.DIR, 'replacementBotChannelId'), this.channel.id);
						resolve(newChannel);
					});
			}
		});
	}

	public clear(): void
	{
		if(fs.existsSync(path.join(this.DIR, 'replacementBotChannelId')))
		{
			fs.unlinkSync(path.join(this.DIR, 'replacementBotChannelId'));
		}
		if(fs.existsSync(this.DIR))
		{
			fs.rmdirSync(this.DIR);
		}
	}

	private createTestChannel(): Promise<TextChannel>
	{
		if(!this.client || !this.client.ready) return Promise.reject('Client is not ready');

		const guildId = TestUtilities.getTestGuildId();
		const guild = this.client.guilds.filter(g => g.id == guildId).first();
		if(!guild)
		{
			throw new Error(`${guildId} is not valid guild id`);
		}
		const channelName = 'replacementbot-test-' + (Math.floor(Math.random() * 999 - 100) + 100);
		const channelData: ChannelData =
		{
			type: 'text',
			topic: '⚠️⚠️ That is testing channel created by ReplacementBot, it should be deleted in a second⚠️⚠️',
		};
		return guild.createChannel(channelName, channelData) as Promise<TextChannel>;
	}
}
