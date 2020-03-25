import Teacher from './teacher';
import Lesson from './lesson';

export default class Replacement
{
	lesson: Lesson;
	description: string;
	newTeacher: Teacher;
	replacedTeacher: Teacher;
	comments: string;
	constructor(lesson: Lesson, description: string, newTeacher?: Teacher, replacedTeacher?: Teacher, comments?: string)
	{
		this.lesson = lesson;
		this.description = description;
		this.newTeacher = newTeacher;
		this.replacedTeacher = replacedTeacher;
		this.comments = comments;
	}
	public toString(): string
	{
		let result = `\r\n:closed_book:  [${this.lesson.toString()}] ${this.description}`;
		if(this.newTeacher && this.replacedTeacher)
		{
			result += `\r\n${this.newTeacher} :arrow_right: ${this.replacedTeacher}`;
		}
		if(this.comments != undefined)
		{
			result += `\r\n${this.comments}`;
		}
		return result;
	}
}
