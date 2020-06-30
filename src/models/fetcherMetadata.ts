import Logger from '../managers/logger';
import chalk from 'chalk';
import TestUtilities from '../../tests/util';

const currentVersion = 0;

export default class FetcherMetadata
{
	public validVersion: boolean;
	public name: string;
	public description: string;
	public author: string;
	public service: string;
	public builtIn: true;
	public system: boolean;

	constructor(json: string, name: string)
	{
		const metadata = JSON.parse(json);

		this.validVersion = true;
		if(metadata.version !== currentVersion)
		{
			Logger.warn(`Fetcher uses unsupported metadata schema. Expected version: ${currentVersion} found ${metadata.version}`);
			this.validVersion = false;
		}

		this.description = metadata.description;
		this.author = metadata.author;
		this.service = metadata.service;
		this.builtIn = metadata['built-in'];
		this.system = metadata.system;
		this.name = name;

		if(this.system && !TestUtilities.isRunningInTest())
		{
			// TODO: add documentation link
			Logger.warn(`Loaded ${chalk.bold('SYSTEM')} fetcher. This fetcher shouldn't be used in normally`);
		}
	}
}

