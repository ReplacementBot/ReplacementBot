import { ReplacementsFetcher, FetcherType } from '../models/replacementsFetcher';
import Logger from './logger';
import Replacement from '../models/replacement';
import ReplacementDay from '../models/replacementDay';
import { Moment } from 'moment';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;
	public initialize(fetcherFileName: string): Promise<void>
	{
		if(this.fetcher != undefined)
		{
			Logger.fatalAndCrash('ReplacementsManager cannot be initialized twice');
		}
		return new Promise((resolve, reject) =>
		{
			import('../fetchers/' + fetcherFileName)
				.then((fetcherClass) =>
				{
					if(!this.isFetcher(fetcherClass))
					{
						Logger.fatalAndCrash(`"${fetcherFileName}" is not a ReplacementsFetcher, check config`);
					}
					// fetcher constructor
					this.fetcher = new fetcherClass.default();
					Logger.info(`Successfully loaded ReplacementsManager with: "${this.getFetcherName()}"`);
					resolve();
				})
				.catch((error) =>
				{
					Logger.fatalAndCrash(`Failed to load ReplacementsFetcher "${fetcherFileName}" file, check config : ${error}`);
					reject();
				});
		});
	}
	private isFetcher(object: any): boolean
	{
		// fetcher constructor
		const testObject = new object.default();
		return testObject.fetchReplacements != undefined;
	}
	private getFetcherName(): string | undefined
	{
		return this.fetcher.constructor.name;
	}

	private fetchFromFetcher(requiredFetcherType: FetcherType, callerName: string, date?: Moment): Promise<ReplacementDay>
	{
		if(this.fetcher.type != requiredFetcherType)
		{
			return Promise.reject(`${this.getFetcherName()} not support "${callerName}" function`);
		}
		else
		{
			return this.fetcher.fetchReplacements(date);
		}
	}
	public fetchReplacements(): Promise<ReplacementDay>
	{
		return this.fetchFromFetcher(FetcherType.ONE_DAY, 'fetchReplacements');
	}
	public fetchSpecificDay(date?: Moment): Promise<ReplacementDay>
	{
		return this.fetchFromFetcher(FetcherType.MULTIPLE_DAYS, 'fetchSpecificDay');
	}
}
