import Replacement from './replacement';
import { Moment } from 'moment';

export default class ReplacementDay
{
	replacements: Replacement[] = [];
	date: Moment;

	constructor(date: Moment, replacements?: Replacement[])
	{
		this.date = date;
		this.replacements = replacements;
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
		return this.date ? this.date.format('dddd') : 'Unknown Day';
	}

	public toString(title = true, safe = false): string
	{
		let result = title ? `**Replacements for: ${this.getWeekDay()}**\r\n` : '';
		if(this.replacements.length == 0) return ':x: No Replacements';
		for(const replacement of this.replacements)
		{
			result += replacement.toString();
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
