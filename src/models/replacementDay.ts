import Replacement from "./replacement";
import { Moment } from "moment"

export default class ReplacementDay
{
	replacements: Replacement[];
	date: Moment

	constructor(date: Moment, replacements: Replacement[])
	{
		this.date = date;
		this.replacements = replacements;
	}

	addReplacement(replacement: Replacement)
	{
		this.replacements.push(replacement);
	}

	addReplacements(replacements: Replacement[])
	{
		for(const replacement of replacements)
		{
			this.replacements.push(replacement);
		}
	}
	
	getWeekDay(): String
	{
		return this.date.format('dddd');;
	}
}