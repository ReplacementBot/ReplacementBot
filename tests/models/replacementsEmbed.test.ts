import { ReplacementsEmbed, ReplacementsEmbedFooterType } from '../../src/models/replacementsEmbed';
import ReplacementDay from '../../src/models/replacementDay';
import moment from 'moment';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';
import Teacher from '../../src/models/teacher';

describe('ReplacementsEmbed', () =>
{
	const replacementDay = new ReplacementDay(
		moment(), [
			new Replacement(
				new Lesson(0, 'Test'),
				'Dummy',
				new Teacher('TestTeacher1'),
				new Teacher('TestTeacher2')),
		]);
	test('Should Build', () =>
	{
		const embed = new ReplacementsEmbed(replacementDay);
		const richEmbed = embed.build('TestTitle', ReplacementsEmbedFooterType.GENERATED_ON);
		expect(richEmbed.fields[0].value).toBe(
			':closed_book: [Test] Dummy' + '\r\n' +
			'TestTeacher1 :arrow_right: TestTeacher2');
	});
});
