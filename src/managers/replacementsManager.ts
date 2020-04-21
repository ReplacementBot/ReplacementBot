import { ReplacementsFetcher } from '../models/replacementsFetcher';

import ReplacementDay from '../models/replacementDay';
import { Moment } from 'moment';
import moment = require('moment');
import Config from './config';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;

	public initialize(fetcherFileName: string): Promise<string>
	{
		if(this.fetcher !== undefined)
		{
			throw new Error('ReplacementsManager cannot be initialized twice');
		}

		return new Promise((resolve, reject) =>
		{
			import('../fetchers/' + fetcherFileName)
				.then((fetcherClass) =>
				{
					if(!this.isFetcher(fetcherClass))
					{
						reject(new Error(`"${fetcherFileName}" is not a ReplacementsFetcher, check config`));
					}
					// fetcher constructor
					this.fetcher = new fetcherClass.default();
					resolve(this.getFetcherName());
				})
				.catch((error) =>
				{
					reject(new Error(`Failed to load fetcher "${fetcherFileName}" file, check config (${error})`));
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
