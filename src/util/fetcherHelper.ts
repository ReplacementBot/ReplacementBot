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
		const urlConfigured = Object.prototype.hasOwnProperty.call(fetcherConfig, 'url');
		const argumentConfigured = Object.prototype.hasOwnProperty.call(fetcherConfig, 'argument');
		if(!urlConfigured)
		{
			Logger.error('FormatURL function has been called but fetcher don\'t have url property');
			return '';
		}
		if(argumentConfigured)
		{
			return fetcherConfig.url.replace('{0}', date.format(fetcherConfig.argument));
		}
		else
		{
			return fetcherConfig.url;
		}
	}
}
