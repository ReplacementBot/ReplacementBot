import { ReplacementsFetcher } from '../../models/replacementsFetcher';
import Replacement from '../../models/replacement';
import Lesson from '../../models/lesson';
import ReplacementDay from '../../models/replacementDay';
import moment from 'moment';
import Teacher from '../../models/teacher';

const lessons = [ 'Art', 'Computer Science', 'English', 'Geography', 'History', 'Maths'];
const teachers = [ 'Patricia Reed', 'Kate Reyes', 'Daisy Newman', 'Wilda Herrera', 'Joanna Tucker', 'Paisley Newman', 'Justine Fox'];

export default class FakeFetcher implements ReplacementsFetcher
{
	public fetchReplacements(date: moment.Moment): Promise<ReplacementDay>
	{
		return new Promise((resolve, reject) =>
		{
			resolve(new ReplacementDay(date, [
				new Replacement(this.randomLesson(2), 'Changed Teacher', this.randomTeacher(), this.randomTeacher()),
				new Replacement(this.randomLesson(3), 'Changed Teacher', this.randomTeacher(), this.randomTeacher()),
				new Replacement(this.randomLesson(7), 'Class Canceled')
			]));
		});
	}

	private randomLesson(num: number): Lesson
	{
		return new Lesson(num, lessons[Math.floor(Math.random() * lessons.length)]);
	}

	private randomTeacher(): Teacher
	{
		return new Teacher(teachers[Math.floor(Math.random() * teachers.length)]);
	}
}
