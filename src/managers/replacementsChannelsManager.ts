import ReplacementBot from '../replacementBot';
import ReplacementsChannels from '../models/replacementsChannel';
import { TextChannel, Collection, Guild, Message } from 'discord.js';
import Config from './config';
import Logger from './logger';

export default class ReplacementsChannelsManager
{
	private bot: ReplacementBot;
	constructor(bot: ReplacementBot)
	{
		this.bot = bot;
	}

	public updateAllGuilds(): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			const channels = this.filterChannels(this.findChannels()).array();
			const promises = [];
			for(const channel of channels)
			{
				promises.push(new ReplacementsChannels(channel, this.bot).update());
			}
			Promise.all(promises.map(p => p.catch(e => e)))
				.then((results) =>
				{
					for (let i = 0; i < results.length; i++)
					{
						const result = results[i];
						if(result instanceof Error)
						{
							Logger.error(`Failed to update channel on ${channels[i].guild.name}\r\n${result}`);
						}
					}
					resolve();
				})
				.catch(error => reject(error));
		});
	}

	public updateSpecificGuild(guild: Guild): Promise<Message>
	{
		const channel = this.filterChannels(this.findChannels()).filter(x => x.guild.id == guild.id).first();
		return new ReplacementsChannels(channel, this.bot).update();
	}

	// Find all replacements channels that has topic tag
	public findChannels(): Collection<string, TextChannel>
	{
		return this.bot.channels.cache.filter((channel: TextChannel) =>
		{
			if(!channel.guild || channel.type != 'text') return false;
			return channel.topic && channel.topic.includes(Config.get('replacementsChannel').topicTag);
		}) as Collection<string, TextChannel>;
	}

	// Reduce replacements channels to only one per guild
	private filterChannels(channels: Collection<string, TextChannel>): Collection<string, TextChannel>
	{
		const foundGuilds: string[] = [];
		return channels.filter((channel: TextChannel) =>
		{
			if(foundGuilds.includes(channel.guild.id))
			{
				return false;
			}
			else
			{
				foundGuilds.push(channel.guild.id);
				return true;
			}
		}) as Collection<string, TextChannel>;
	}
}
