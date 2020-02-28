import Replacement from './replacement';
import { Moment } from 'moment';

export default class ReplacementDay
{
	replacements: Replacement[] = [];
	date: Moment;

	constructor(date: Moment, replacements?: Replacement[])
	{
		this.date = date;
		if(replacements)
		{
			// FIXME
			for(const replacement of replacements)
			{
				if(replacement.description.includes('1'))
				{
					this.replacements.push(replacement);
				}
			}
		}
	}

	public addReplacement(replacement: Replacement): void
	{
		this.replacements.push(replacement);
	}

	public addReplacements(replacements: Replacement[]): void
	{
		for(const replacement of replacements)
		{
			this.replacements.push(replacement);
		}
	}

	public getWeekDay(): string
	{
		return this.date.format('dddd');
	}

	public toString(title = true, safe = false): string
	{
		let result = title ? `**Replacements for: ${this.getWeekDay()}**` : '';
		for(const replacement of this.replacements)
		{
			result += '\r' + replacement.toString();
		}
		if(safe)
		{
			if(result.length > 1900)
			{
				result = result.substring(0, 1500) + '... \r\r *Some replacements has been cut because message was to big*';
			}
		}
		return result;
	}
}
