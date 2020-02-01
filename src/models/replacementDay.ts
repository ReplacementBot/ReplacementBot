import Replacement from './replacement';
import { Moment } from 'moment';

export default class ReplacementDay
{
	replacements: Replacement[];
	date: Moment

	constructor(date: Moment, replacements: Replacement[])
	{
		this.date = date;
		this.replacements = replacements;
	}

	addReplacement(replacement: Replacement): void
	{
		this.replacements.push(replacement);
	}

	addReplacements(replacements: Replacement[]): void
	{
		for(const replacement of replacements)
		{
			this.replacements.push(replacement);
		}
	}

	getWeekDay(): string
	{
		return this.date.format('dddd');
	}
}