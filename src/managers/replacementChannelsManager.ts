import ReplacementBot from '../replacementBot';
import ReplacementsChannels from '../models/replacementsChannel';
import { TextChannel, Collection, Guild } from 'discord.js';
import Config from './config';

export default class ReplacementChannelsManager
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
			const channels = this.filterChannels(this.findChannels());
			const promises = [];
			for(const channel of channels)
			{
				promises.push(new ReplacementsChannels(channel[1], this.bot).update());
			}
			Promise.all(promises.map(p => p.catch(e => e)))
				.then(() =>
				{
					// TODO: inform somehow server owner that something broke
					resolve();
				})
				.catch(error => reject(error));
		});
	}

	public updateSpecificGuild(guild: Guild): Promise<void>
	{
		const channel = this.filterChannels(this.findChannels()).filter(x => x.guild.id == guild.id).first();
		return new ReplacementsChannels(channel, this.bot).update();
	}

	// Find all replacements channels that has topic tag
	public findChannels(): Collection<string, TextChannel>
	{
		return this.bot.channels.filter((channel: TextChannel) =>
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
