/*
* This is custom Commando dispatcher for unit testing
* using this dispatcher makes that bot will reply to
* messages created by bot (and himself). By that way
* bot can trigger own commands
*/

import { CommandoClient } from 'discord.js-commando';

import { CommandRegistry } from 'discord.js-commando';
import { Message } from 'discord.js';
import Logger from '../managers/logger';
import Helpers from './helpers';

export default class UnitTestDispatcher extends require('discord.js-commando/src/dispatcher')
{
	constructor(client: CommandoClient, registry: CommandRegistry)
	{
		if(!Helpers.isRunningInTest())
		{
			Logger.error('UnitTestDispatcher has been initialized outside tests, that will create problems with executing commands');
		}
		super(client, registry);
		super['shouldHandleMessage'] = function(message: Message, oldMessage: Message): boolean
		{
			return true;
		};
	}
}
