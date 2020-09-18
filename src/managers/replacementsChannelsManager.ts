import ReplacementBot from '../replacementBot';
import ReplacementsChannel from '../models/replacementsChannel';
import { TextChannel, Collection, Guild } from 'discord.js';
import Config from './config';
import Logger from './logger';

export default class ReplacementsChannelsManager
{
	private bot: ReplacementBot;
	constructor(bot: ReplacementBot)
	{
		this.bot = bot;
	}

	public updateAllChannels(): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			const channels = this.findOneChannelPerGuild().array();
			const promises = [];
			for(const channel of channels)
			{
				promises.push(channel.update());
			}
			Promise.all(promises.map(p => p.catch(e => e)))
				.then((results) =>
				{
					for (let i = 0; i < results.length; i++)
					{
						const result = results[i];
						if(result instanceof Error)
						{
							Logger.error('ReplacementsChannelsManager', `Failed to update channel on ${channels[i].channel.guild.name}\r\n${result}`);
						}
					}
					resolve();
				})
				.catch(error => reject(error));
		});
	}

	public findAllChannels(): Collection<string, ReplacementsChannel>
	{
		const result = new Collection<string, ReplacementsChannel>();
		const channels = this.bot.channels.cache
			.filter((channel: TextChannel) =>
			{
				if(!channel.guild || channel.type != 'text') return false;
				return channel.topic && channel.topic.includes(Config.get('replacementsChannel').topicTag);
			});
		channels.forEach((channel: TextChannel) =>
		{
			result.set(channel.id, new ReplacementsChannel(channel, this.bot));
		});
		return result;
	}

	public findOneChannelPerGuild(): Collection<string, ReplacementsChannel>
	{
		const foundGuilds: string[] = [];
		const result: Collection<string, ReplacementsChannel> = new Collection<string, ReplacementsChannel>();
		this.findAllChannels()
			.forEach((channel) =>
			{
				if(!foundGuilds.includes(channel.channel.guild.id))
				{
					foundGuilds.push(channel.channel.guild.id);
					result.set(channel.channel.id, channel);
				}
			});
		return result;
	}

	public findAllGuildChannels(guild: Guild): Collection<string, ReplacementsChannel>
	{
		return this.findAllChannels().filter(x => x.channel.guild.id === guild.id);
	}
}
