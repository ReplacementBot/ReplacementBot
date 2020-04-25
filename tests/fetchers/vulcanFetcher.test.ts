import Config from '../../src/managers/config';
import ReplacementDay from '../../src/models/replacementDay';
import Replacement from '../../src/models/replacement';
import Lesson from '../../src/models/lesson';
import Teacher from '../../src/models/teacher';
import { FetchError } from '../../src/util/errors';
import moment from 'moment';
import TestUtilities from '../util';
import ReplacementsManager from '../../src/managers/replacementsManager';

describe('Vulcan Fetcher', () =>
{
	const fetchingTime = moment();
	test('should fetch replacements', async () =>
	{
		Config.initialize(TestUtilities.generateFetcherConfig(
			'vulcanFetcher',
			{ url: 'http://mrbartusek.000webhostapp.com/ReplacementBot/VulcanUnitTest.html' },
		));

		const manager = new ReplacementsManager();
		await expect(manager.initialize('vulcanFetcher')).resolves.toBe('VulcanFetcher');
		await expect(manager.fetchReplacements(fetchingTime)).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, [
				new Replacement(new Lesson(1), 'Description1', new Teacher('AbsentTeacher1'), new Teacher('NewTeacher1'), 'Comment1'),
				new Replacement(new Lesson(2), 'Description2', new Teacher('AbsentTeacher2'), new Teacher('NewTeacher2'), 'Comment2'),
			]),
		);
	});

	test('should give empty result', async () =>
	{
		Config.initialize(TestUtilities.generateFetcherConfig(
			'vulcanFetcher',
			{ url: 'http://mrbartusek.000webhostapp.com/ReplacementBot/VulcanEmptyUnitTest.html' },
		));

		const manager = new ReplacementsManager();
		await expect(manager.initialize('vulcanFetcher')).resolves.toBe('VulcanFetcher');
		await expect(manager.fetchReplacements(fetchingTime)).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, []),
		);
	});

	test('should handle errors', async () =>
	{
		Config.initialize(TestUtilities.generateFetcherConfig(
			'vulcanFetcher',
			{ url: 'https://httpstat.us/500' },
		));

		const manager = new ReplacementsManager();
		await expect(manager.initialize('vulcanFetcher')).resolves.toBe('VulcanFetcher');
		await expect(manager.fetchReplacements(fetchingTime)).rejects.toEqual(new FetchError('Server returned bad code (500)'));
	});
});
