import Lesson from '../src/models/lesson';
import Replacement from '../src/models/replacement';
import Teacher from '../src/models/teacher';

describe('Models', () =>
{
	describe('Lesson', () =>
	{
		describe('should convert to string', () =>
		{
			test('name & number', () =>
			{
				const lesson = new Lesson(42, 'Test');
				expect(lesson.toString()).toBe('42 - Test');
			});
			test('name only', () =>
			{
				const lesson = new Lesson(undefined, 'Test');
				expect(lesson.toString()).toBe('Test');
			});
			test('number only', () =>
			{
				const lesson = new Lesson(42);
				expect(lesson.toString()).toBe('42');
			});
		});
	});
	describe('Replacement', () =>
	{
		test('should convert to string', () =>
		{
			const replacement = new Replacement(
				new Lesson(42, 'Test'),
				'Description',
				new Teacher('New Teacher'),
				new Teacher('Replaced Teacher'),
				'Comment',
			);
			expect(replacement.toString()).toBe(
				'\r\n:closed_book: [42 - Test] Description' + '\r\n' +
				'New Teacher :arrow_right: Replaced Teacher' + '\r\n' +
				'Comment',
			);
		});
	});
});
