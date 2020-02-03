export default class Lesson
{
	lessonNumber: number;
	lessonName: string;
	constructor(lessonName: string, lessonNumber?: number)
	{
		this.lessonName = lessonName;
		this.lessonNumber = lessonNumber;
	}
}
