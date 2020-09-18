import { ReplacementsFetcher } from '../models/replacementsFetcher';
import FetcherMetadata from '../models/fetcherMetadata';
import TestUtilities from '../../tests/util';
import Config from '../managers/config';
import fs from 'fs';
import convict from 'convict';
import Logger from '../managers/logger';

export default class FetcherLoader
{
	public static async loadFetcher(fetcherName: string): Promise<[ReplacementsFetcher, FetcherMetadata]>
	{
		const fetcher = await this.loadFetcherScript(fetcherName);
		const metadata = this.loadMetadata(fetcherName);
		return [fetcher, metadata];
	}

	private static loadFetcherScript(fetcherName: string): Promise<ReplacementsFetcher>
	{
		return new Promise((resolve, reject) =>
		{
			// While running bot it doesn't work with ts files anymore
			// However, Jest don't create js files and still operates on ts
			const path = `../fetchers/${fetcherName}/fetcher.${TestUtilities.isRunningInTest() ? 'ts' : 'js'}`;

			import(path)
				.then((fetcherClass) =>
				{
					let fetcher: ReplacementsFetcher;
					if(!this.isFetcher(fetcherClass)) return Promise.reject(new Error(`"${fetcherName}" is not a ReplacementsFetcher`));

					try
					{
						fetcher = new fetcherClass.default();
					}
					catch
					{
						reject(new Error('Fetcher thrown error inside constructor'));
						return;
					}

					if(fetcher.initialize == null)
					{
						resolve(fetcher);
					}
					else
					{
						fetcher.initialize(this.loadFetcherConfig(fetcherClass))
							.then(() => resolve(fetcher))
							.catch((error: Error) => reject(new Error(`Fetcher initialization error (${error})`)));
					}

				})
				.catch((error) =>
				{
					console.log(error);
					reject(new Error(`Failed to import fetcher "${fetcherName}" (${error})`));
				});
		});
	}

	private static loadMetadata(fetcherName: string): FetcherMetadata
	{
		const metadataPath = __dirname + `/../fetchers/${fetcherName}/metadata.json`;
		if(fs.existsSync(metadataPath))
		{
			return new FetcherMetadata(fs.readFileSync(metadataPath).toString(), fetcherName);
		}
		else
		{
			return new FetcherMetadata('{}', fetcherName);
		}
	}

	private static loadFetcherConfig(fetcherClass: any): any
	{
		const schema = fetcherClass.default.configSchema;
		if(schema && Object.keys(schema) && Object.keys(schema).length > 0)
		{
			const config = convict(schema);
			config.load(Config.get('fetcher').config);

			// Slightly hacky way to remove default convict prefix https://github.com/mozilla/node-convict/issues/363
			// @ts-ignore types file is outdated
			config.validate({ allowed: 'warn', output: (warning: string) => Logger.warn('Config', 'Found Fetcher Configuration Errors:\n' + warning.substr(20)) });
			return config;
		}
	}

	private static isFetcher(object: any): boolean
	{
		const testObject = new object.default();
		return testObject.fetchReplacements != undefined;
	}
}
