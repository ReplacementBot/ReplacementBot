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
		Config.initialize('{}');
		const manager = new ReplacementsManager();
		const fetchingTime = moment();
		test('should Initialize itself', () =>
		{
			return expect(manager.initialize('TestFetcher')).resolves.toBe('TestFetcher');
		});

		test('should fetch from provided date && initializeFetcher', () =>
		{
			return expect(manager.fetchReplacements(fetchingTime)).resolves.toEqual(
				new ReplacementDay(fetchingTime, [ new Replacement(new Lesson(0, 'Test'), 'initialized: true')])
			);
		});

		test('should handle fail', () =>
		{
			process.env.TEST_FETCHER_FAIL = 'error';
			return expect(manager.fetchReplacements(fetchingTime)).rejects.toStrictEqual(new Error('Triggered Fail'));
		});
	});
});
