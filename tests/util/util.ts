import * as fs from 'fs';
import * as yaml from 'js-yaml';
import appRoot from 'app-root-path';
import { Channel, TextChannel, Client, ChannelData, Guild } from 'discord.js';
import Logger from '../../src/managers/logger';
import { ConfigSettings, ConfigSources } from '../../src/managers/config';

export default class TestUtilities
{
	static defaultConfigSettings = new ConfigSettings(ConfigSources.FILE, 'tests/resources/default.yaml');
	static commandPrefix = 'replacement-test!';
	public static getTestGuildId(): string
	{
		return process.env.REPLACEMENT_BOT_TEST_GUILD;
	}
}