import VulcanFetcher from '../../src/fetchers/VulcanFetcher/fetcher';
import ReplacementDay from '../../src/models/replacementDay';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';
import Teacher from '../../src/models/teacher';

import moment from 'moment';
import convict from 'convict';

describe('Vulcan Fetcher', () =>
{
	const fetchingTime = moment();
	test('should fetch replacements', async () =>
	{
		const config = convict(VulcanFetcher.configSchema).load({ url: 'testData:///VulcanUnitTest.html' });
		const fetcher = new VulcanFetcher();
		fetcher.initialize(config);
		await expect(fetcher.fetchReplacements(fetchingTime)).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, [
				new Replacement(new Lesson(1), 'Description1', new Teacher('AbsentTeacher1'), new Teacher('NewTeacher1'), 'Comment1'),
				new Replacement(new Lesson(2), 'Description2', new Teacher('AbsentTeacher2'), new Teacher('NewTeacher2'), 'Comment2')
			])
		);
	});
});
