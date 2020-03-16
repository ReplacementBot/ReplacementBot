import VulcanFetcher from '../src/fetchers/vulcanFetcher';
import { Config, ConfigSettings, ConfigSources } from '../src/managers/config';
import ReplacementDay from '../src/models/replacementDay';
import Replacement from '../src/models/replacement';
import Lesson from '../src/models/lesson';
import Teacher from '../src/models/teacher';
import { FetchError } from '../src/models/replacementsFetcher';
import moment from 'moment';

describe('Vulcan Fetcher', () =>
{
	const fetchingTime = moment();
	test('should fetch replacements', async () =>
	{
		new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/vulcanFetcherTest.yaml')).makeStatic();
		await expect(new VulcanFetcher().fetchReplacements(fetchingTime)).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, [
				new Replacement(new Lesson(1), 'Description1', new Teacher('AbsentTeacher1'), new Teacher('NewTeacher1'), 'Comment1'),
				new Replacement(new Lesson(2), 'Description2', new Teacher('AbsentTeacher2'), new Teacher('NewTeacher2'), 'Comment2'),
			]),
		);
	});

	test('should give empty result', async () =>
	{
		new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/vulcanFetcherEmptyTest.yaml')).makeStatic();
		await expect(new VulcanFetcher().fetchReplacements(moment(fetchingTime))).resolves.toStrictEqual(
			new ReplacementDay(fetchingTime, []),
		);
	});

	test('should handle errors', async () =>
	{
		new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/vulcanFetcherErrorTest.yaml')).makeStatic();
		await expect(new VulcanFetcher().fetchReplacements(moment())).rejects.toEqual(new FetchError('Server returned bad code (500)'));
	});
});
