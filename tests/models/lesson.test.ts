import Lesson from '../../src/models/lesson';

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
