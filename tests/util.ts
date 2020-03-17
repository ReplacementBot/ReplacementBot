import fs from 'fs';
import yaml from 'js-yaml';
import appRoot from 'app-root-path';
import { Channel, TextChannel, Client, ChannelData, Guild } from 'discord.js';
import Logger from '../src/managers/logger';
import { ConfigSettings, ConfigSources } from '../src/managers/config';

export default class TestUtilities
{
	static defaultConfigSettings = new ConfigSettings(ConfigSources.FILE, 'tests/resources/default.yaml');
	static commandPrefix = 'replacement-test!';
	public static getTestGuildId(): string
	{
		const content = fs.readFileSync(appRoot + '/config/test.yaml');
		const data = yaml.safeLoad(content.toString());
		return data.testGuildId;
	}

	public static setupTestChannel(client: Client): Promise<TextChannel>
	{
		const guildId = this.getTestGuildId();
		const guild = client.guilds.filter(g => g.id == guildId).first();
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
