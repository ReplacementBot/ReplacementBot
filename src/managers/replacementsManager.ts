import { ReplacementsFetcher } from '../models/replacementsFetcher';
import ReplacementDay from '../models/replacementDay';
import Config from './config';
import fs from 'fs';

import FetcherMetadata from '../models/fetcherMetadata';
import moment, { Moment } from 'moment';
import TestUtilities from '../../tests/util';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;
	metadata: FetcherMetadata;

	// INITIALIZATION

	public async initialize(fetcherName: string): Promise<string>
	{
		if(this.fetcher !== undefined)
		{
			throw new Error('ReplacementsManager cannot be initialized twice');
		}

		await this.loadFetcher(fetcherName);
		this.metadata = this.loadMetadata(fetcherName);
		return fetcherName;
	}

	private loadFetcher(fetcherName: string): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			// While running bot it doesn't work with ts files anymore
			// Hoverer, Jest don't create js files and still operates on ts
			const path = `../fetchers/${fetcherName}/fetcher.${TestUtilities.isRunningInTest() ? 'ts' : 'js'}`;

			import(path)
				.then((fetcherClass) =>
				{
					if(!this.isFetcher(fetcherClass))
					{
						return Promise.reject(new Error(`"${fetcherName}" is not a ReplacementsFetcher`));
					}

					try
					{
						// fetcher constructor
						this.fetcher = new fetcherClass.default();
					}
					catch
					{
						reject(new Error('fetcher thrown error inside constructor'));
						return;
					}

					if(this.fetcher.initialize)
					{
						this.fetcher.initialize(Config.get('fetcher').config)
							.then(() =>
							{
								resolve();
							})
							.catch((error) =>
							{
								reject(new Error(`fetcher initialization error (${error})`));
							});
					}
					else
					{
						resolve();
					}

				})
				.catch((error) =>
				{
					reject(new Error(`Failed to import fetcher "${fetcherName}" (${error})`));
				});
		});
	}

	private loadMetadata(fetcherName: string): FetcherMetadata
	{
		const data = fs.readFileSync(__dirname + `/../fetchers/${fetcherName}/metadata.json`);
		return new FetcherMetadata(data.toString());
	}

	private isFetcher(object: any): boolean
	{
		// fetcher constructor
		const testObject = new object.default();
		return testObject.fetchReplacements != undefined;
	}

	// RETRIEVING DATA

	public getMetadata(): FetcherMetadata
	{
		return this.metadata;
	}

	public fetchReplacements(date?: Moment): Promise<ReplacementDay>
	{
		if(this.fetcher === undefined) throw new Error('fetchReplacements was called but ReplacementsManager hasn\'t been initialized');
		if(!date) date = this.getDefaultDate();
		return new Promise((resolve, reject) =>
		{
			this.fetcher.fetchReplacements(date)
				.then((result) =>
				{
					resolve(this.filterReplacement(result as ReplacementDay));
				})
				.catch((error) =>
				{
					reject(error);
				});
		});
	}

	private filterReplacement(replacementDay: ReplacementDay): ReplacementDay
	{
		const result = new ReplacementDay(replacementDay.date);
		const regex = new RegExp(Config.get('replacementsFilter'));
		for(const replacement of replacementDay.replacements)
		{
			if(regex.test(replacement.description))
			{
				result.addReplacement(replacement);
			}
		}
		return result;
	}

	// HELPERS

	private getDefaultDate(): Moment
	{
		const switchHour = Config.get('daySwitchHour');
		if(!switchHour)
		{
			return moment();
		}
		const switchHourMoment = moment(switchHour, 'k-m');
		if(!switchHourMoment.isValid())
		{
			return moment();
		}
		if(moment().diff(switchHourMoment, 'minutes') >= 0)
		{
			return moment().add(1, 'days');
		}
		else
		{
			return moment();
		}
	}
}
