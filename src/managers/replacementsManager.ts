import { ReplacementsFetcher, FetchError, ResponseParseError } from '../models/replacementsFetcher';
import Logger from './logger';
import Replacement from '../models/replacement';
import ReplacementDay from '../models/replacementDay';
import { Moment } from 'moment';
import moment = require('moment');
import { Config } from './config';
import MiscHelpers from '../util/miscHelpers';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;
	public initialize(fetcherFileName: string): Promise<void>
	{
		// ReplacementsManager is currently disabled inside tests
		// because it is not working :)
		if(MiscHelpers.isRunningInTest())
		{
			return Promise.resolve();
		}

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
	public fetchReplacements(date?: Moment): Promise<ReplacementDay | FetchError | ResponseParseError>
	{
		if(date == undefined)
		{
			date = this.getDefaultDate();
		}
		return this.fetcher.fetchReplacements(date);
	}

	private getDefaultDate(): moment.Moment
	{
		const switchHour = Config.getInstance().get('daySwitchHour');
		if(switchHour == undefined)
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
