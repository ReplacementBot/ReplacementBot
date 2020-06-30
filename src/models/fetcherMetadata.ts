import Logger from '../managers/logger';
import chalk from 'chalk';
import TestUtilities from '../../tests/util';

const currentVersion = 0;

export default class FetcherMetadata
{
	private validVersion: boolean;
	private name: string;
	private description: string;
	private author: string;
	private service: string;
	private builtIn: true;
	private system: boolean;

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

	public isValidVersion(): boolean
	{
		return this.validVersion;
	}

	public getName(): string
	{
		if(this.name != null)
		{
			return this.name;
		}
		else
		{
			return 'Unknown Name';
		}
	}

	public getDescription(): string
	{
		if(this.description != null)
		{
			return this.description;
		}
		else
		{
			return 'Unknown Description';
		}
	}

	public getAuthor(): string
	{
		if(this.author != null)
		{
			return this.author;
		}
		else
		{
			return 'Unknown Author';
		}
	}

	public getService(): string
	{
		if(this.service != null)
		{
			return this.service;
		}
	}

	public isBuiltIn(): boolean
	{
		if(this.builtIn != null)
		{
			return this.builtIn;
		}
		else
		{
			return false;
		}
	}

	public isSystem(): boolean
	{
		if(this.system != null)
		{
			return this.system;
		}
		else
		{
			return false;
		}
	}
}

