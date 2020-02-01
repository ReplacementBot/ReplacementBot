import Teacher from './teacher';
import Lesson from './lesson';

export default class Replacement
{
	lesson: Lesson;
	description: string;
	teacher: Teacher;
	comments: string;
	constructor(lesson: Lesson, description: string, teacher: Teacher, comments: string)
	{
		this.lesson = lesson;
		this.description = description;
		this.teacher = teacher;
		this.comments = comments;
	}
	public toString(): string
	{
		let result = '**[' + this.lesson + ']** ' + this.description;
		if(this.teacher != undefined)
		{
			result += ' | ' + this.teacher;
		}
		if(this.comments != undefined)
		{
			result += ' | ' + this.comments;
		}
		return result;
	}
}
