import moment from 'moment';

export default class URLFormatter
{
	public static formatUrl(url: string, date: moment.Moment): string
	{
		this.checkURL(url);
		const variablesRegex = new RegExp(/{(.*?)\((.*?)\)}/g);
		const variables = url.match(variablesRegex);
		if(variables && variables.length > 0)
		{
			for(const variableRaw of variables)
			{
				const variable = variableRaw.slice(0, -1).slice(1);
				if(variable.startsWith('moment('))
				{
					const format = variable.replace('moment(', '').replace(')', '');
					url = url.replace(variableRaw, date.format(format));
				}
				else if(variable.startsWith('random('))
				{
					url = url.replace(variableRaw, Math.floor(Math.random() * (1000 - 1 + 1) + 1).toString());
				}
				else
				{
					throw new Error(`Unknown URLFormatter variable "${variable}"`);
				}
			}
		}
		return url;
	}

	private static checkURL(url: string): void
	{
		if(typeof url !== 'string')
		{
			throw TypeError('URL passed to URLFormatter must be string');
		}
		else if(!url || url.length == 0)
		{
			throw TypeError('URL passed to URLFormatter cannot be empty');
		}
	}
}
