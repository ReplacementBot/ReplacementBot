import Logger from '../managers/logger';
import moment = require('moment');

export default class FetchersHelper
{
	public static formatURL(fetcherConfig: any, date: moment.Moment): string
	{
		if(typeof fetcherConfig != 'object')
		{
			Logger.error('FormatURL function has been called with "fetcherConfig" argument which is not object');
			return '';
		}
		const urlConfigured = fetcherConfig.url != undefined;
		const argumentConfigured = fetcherConfig.argument != undefined;
		if(!urlConfigured)
		{
			Logger.error('FormatURL function has been called but fetcher don\'t have url property');
			return '';
		}
		if(argumentConfigured && date != undefined)
		{
			return fetcherConfig.url.replace('{0}', date.format(fetcherConfig.argument));
		}
		else
		{
			return fetcherConfig.url;
		}
	}
}
