export default class Lesson
{
	number: number;
	name: string;
	constructor(number?: number, name?: string)
	{
		this.name = name;
		this.number = number;
	}

	public toString(): string
	{
		if(this.name && this.number)
		{
			return this.number.toString() + ' - ' + this.name;
		}
		else if(this.number)
		{
			return this.number.toString();
		}
		else if(this.name)
		{
			return this.name;
		}
		else
		{
			return '0';
		}
	}
}
