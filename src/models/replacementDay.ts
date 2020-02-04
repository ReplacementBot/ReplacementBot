import Replacement from './replacement';
import { Moment } from 'moment';

export default class ReplacementDay
{
	replacements: Replacement[];
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
		return this.date.format('dddd');
	}

	public toString(title = true): string
	{
		let result = title ? `**Replacements for: ${this.getWeekDay()}**` : '';
		for(const replacement of this.replacements)
		{
			result += '\r' + replacement.toString();
		}
		return result;
	}
}
