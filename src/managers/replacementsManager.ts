import { ReplacementsFetcher, FetchError, ResponseParseError } from '../models/replacementsFetcher';
import Logger from './logger';
import ReplacementDay from '../models/replacementDay';
import { Moment } from 'moment';
import moment = require('moment');
import Config from './config';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;

	public initialize(fetcherFileName: string): Promise<void>
	{
		if(this.fetcher !== undefined)
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

	public fetchReplacements(date?: Moment): Promise<ReplacementDay | FetchError | ResponseParseError>
	{
		if(this.fetcher === undefined) throw new Error('fetchReplacements was called but ReplacementsManager hasn\'t been initialized');
		if(!date) date = this.getDefaultDate();
		return new Promise((resolve, reject) =>
		{
			this.fetcher.fetchReplacements(date)
				.catch((error) =>
				{
					if(this.verifyFetcherResponse(error, 'reject'))
					{
						Logger.warn(`Fetcher produced illegal response(${typeof error} whiled rejected`);
						resolve(this.filterReplacement(error));
					}
					else
					{
						reject(error);
					}
				})
				.then((result) =>
				{
					if(this.verifyFetcherResponse(result, 'resolve'))
					{
						Logger.warn(`Fetcher produced illegal response(${typeof result} whiled resolved`);
						reject(result);
					}
					else
					{
						resolve(this.filterReplacement(result as ReplacementDay));
					}
				});
		});
	}

	private verifyFetcherResponse(response: void | ReplacementDay | FetchError | ResponseParseError, method: 'resolve' | 'reject'): boolean
	{
		if(method == 'resolve')
		{
			return typeof response == typeof ReplacementDay;
		}
		else
		{
			typeof response != typeof ReplacementDay;
		}
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

	private getDefaultDate(): moment.Moment
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
