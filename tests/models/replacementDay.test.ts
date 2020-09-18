import ReplacementDay from '../../src/models/replacementDay';
import moment from 'moment';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';

describe('ReplacementDay', () =>
{
	const replacement1 = new Replacement(new Lesson(0), 'Test');
	const replacement2 = new Replacement(new Lesson(0), 'Test2');
	const replacementDay = new ReplacementDay(moment(), [ replacement1 ]);
	replacementDay.addReplacement(replacement2);
	test('should add replacements', () =>
	{
		expect(replacementDay.replacements).toStrictEqual(
			[
				new Replacement(new Lesson(0), 'Test'),
				new Replacement(new Lesson(0), 'Test2')
			]
		);
	});
	test('should convert to string', () =>
	{
		expect(replacementDay.toString()).toContain('**[0]** Test');
		expect(replacementDay.toString()).toContain(`**Replacements for: ${moment().format('dddd')}**`);
	});
	test('should detect too big strings', () =>
	{
		const bigReplacementDay = new ReplacementDay(moment());
		for (let i = 0; i < 200; i++)
		{
			bigReplacementDay.addReplacement(replacement1);
		}
		expect(bigReplacementDay.toString(true, true).length).toBeLessThan(2000);
	});
});
