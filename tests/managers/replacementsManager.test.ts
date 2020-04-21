import ReplacementsManager from '../../src/managers/replacementsManager';
import ReplacementDay from '../../src/models/replacementDay';
import moment from 'moment';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';
import Config from '../../src/managers/config';

describe('ReplacementManager', () =>
{
	describe('Should Fetch', () =>
	{
		Config.initialize();
		const manager = new ReplacementsManager();
		const fetchingTime = moment();
		test('Should Initialize', () =>
		{
			return expect(manager.initialize('dummyFetcher')).resolves.toBe(undefined);
		});

		test('Should Fetch from provided date', () =>
		{
			return expect(manager.fetchReplacements(fetchingTime)).resolves.toStrictEqual(
				new ReplacementDay(fetchingTime, [ new Replacement(new Lesson(0, 'Dummy Lesson'), 'Dummy')]),
			);
		});
	});
});
