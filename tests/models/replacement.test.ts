import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';
import Teacher from '../../src/models/teacher';

describe('Replacement', () =>
{
	test('should convert to string', () =>
	{
		const replacement = new Replacement(
			new Lesson(42, 'Test'),
			'Description',
			new Teacher('New Teacher'),
			new Teacher('Replaced Teacher'),
			'Comment'
		);
		expect(replacement.toString()).toBe(
			':closed_book: [42 - Test] Description' + '\r\n' +
			'New Teacher :arrow_right: Replaced Teacher' + '\r\n' +
			'Comment'
		);
	});
});
