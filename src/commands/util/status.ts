import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed, Client } from 'discord.js';
import moment from 'moment';
import ReplacementBot from '../../replacementBot';
import ReplacementsManager from '../../managers/replacementsManager';

export default class StatusCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'status',
			group: 'util',
			memberName: 'status',
			aliases: ['info', 'health', 'fetcher', 's'],
			description: 'Display information about current instance',
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		const bot = this.client as ReplacementBot;
		const embed = new MessageEmbed()
			.setColor('DARK_VIVID_PINK')
			.setThumbnail('https://replacementbot.github.io/docs/assets/images/replacementbot-logo-512-circle.png')
			.setTitle('ReplacementBot status')
			.setDescription('Powerful School Replacements bot for your Discord Server')
			.addField('Fetcher', this.getFetcherMetadata(bot.replacementsManager))
			.addField('Uptime', 'This instancie is running since ' + this.getUptime(this.client));

		return message.channel.send(embed);
	}

	private getUptime(client: Client): string
	{
		const uptime = moment.duration(client.uptime);
		if(uptime.asSeconds() < 60)
		{
			return `${Math.round(uptime.asSeconds())} second${Math.round(uptime.asSeconds()) == 1 ? '' : 's'}`;
		}
		else if(uptime.asMinutes() < 60)
		{
			return `${Math.round(uptime.asMinutes())} minute${Math.round(uptime.asMinutes()) == 1 ? '' : 's'}`;
		}
		else
		{
			return `${Math.round(uptime.asHours())} hour${Math.round(uptime.asHours()) == 1 ? '' : 's'}`;
		}
	}

	private getFetcherMetadata(manager: ReplacementsManager): string
	{
		const metadata = manager.getMetadata();
		let result = `${metadata.isBuiltIn() ? '[Built-In]' : '[Custom]'} ${metadata.getName()} by ${metadata.getAuthor()}`;
		if(metadata.getAuthor() != 'Unknown Author')
		{
			result += '\r\nhttps://github.com/' + metadata.getAuthor();
		}
		if(metadata.getDescription() != null)
		{
			result += '\r\n' + metadata.getDescription();
		}
		return result;
	}
}
