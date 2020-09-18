import { ReplacementsFetcher } from '../models/replacementsFetcher';
import ReplacementDay from '../models/replacementDay';
import Config from './config';
import FetcherMetadata from '../models/fetcherMetadata';
import moment, { Moment } from 'moment';
import FetcherLoader from '../util/fetcherLoader';
import Logger from './logger';

export default class ReplacementsManager
{
	fetcher: ReplacementsFetcher;
	metadata: FetcherMetadata;

	public async initialize(fetcherName: string): Promise<string>
	{
		const result = await FetcherLoader.loadFetcher(fetcherName);
		this.fetcher = result[0];
		this.metadata = result[1];
		return this.metadata.getName();
	}

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
				.catch(reject);
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

	private getDefaultDate(): Moment
	{
		const switchHour = Config.get('daySwitchHour');
		const switchHourMoment = moment(switchHour, 'k-m');
		if(!switchHourMoment.isValid())
		{
			Logger.warn('ReplacementsManager', '"daySwitchHour" config entry is not valid. Day switching is not enabled');
		}
		else if(moment().diff(switchHourMoment, 'minutes') >= 0)
		{
			return moment().add(1, 'days');
		}
		else
		{
			return moment();
		}
	}
}
