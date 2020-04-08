import DummyFetcher from '../../src/fetchers/dummyFetcher';
import moment from 'moment';
import ReplacementDay from '../../src/models/replacementDay';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';

describe('Dummy Fetcher', () =>
{
	const fetchingTime = moment();
	test('should give dummy result', async () =>
	{
		await expect(new DummyFetcher().fetchReplacements(fetchingTime)).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, [ new Replacement(new Lesson(0, 'Dummy Lesson'), 'Dummy')]),
		);
	});
});
