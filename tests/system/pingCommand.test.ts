import ReplacementBot from '../../src/replacementBot';
import { ConfigSettings, ConfigSources } from '../../src/managers/config';
import TestUtilities from '../util/util';
import { Message, MessageCollector } from 'discord.js';
import WebFetcher from '../../src/util/webFetcher';
import Logger from '../../src/managers/logger';
import { SystemTest } from '../util/systemTest';
declare function fail(error?: any): never;

describe('Ping Command', () =>
{
	test('should ping bot', (done) => new SystemTest('ping', 'Pinging...', done));
});

