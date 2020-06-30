import Logger from '../managers/logger';
import chalk from 'chalk';

const currentVersion = 0;

export default class FetcherMetadata
{
	validVersion: boolean;
	description: string;
	author: string;
	service: string;
	builtIn: true;
	system: boolean;

	constructor(json: string)
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

		if(this.system)
		{
			// TODO: add documentation link
			Logger.warn(`Loaded ${chalk.bold('SYSTEM')} fetcher. This fetcher shouldn't be used in normally`);
		}
	}
}

