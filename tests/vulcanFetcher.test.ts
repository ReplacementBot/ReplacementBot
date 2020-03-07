import VulcanFetcher from '../src/fetchers/vulcanFetcher';
import { Config, ConfigSettings, ConfigSources } from '../src/managers/config';
import ReplacementDay from '../src/models/replacementDay';
import Replacement from '../src/models/replacement';
import Lesson from '../src/models/lesson';
import Teacher from '../src/models/teacher';

describe('Vulcan Fetcher', () =>
{
	test('should fetch replacements', async () =>
	{
		new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/vulcanFetcherTest.yaml')).makeStatic();
		await expect(new VulcanFetcher().fetchReplacements()).resolves.toStrictEqual(
			new ReplacementDay(undefined, [
				new Replacement(new Lesson(1), 'Description1', new Teacher('AbsentTeacher1'), new Teacher('NewTeacher1'), 'Comment1'),
				new Replacement(new Lesson(2), 'Description2', new Teacher('AbsentTeacher2'), new Teacher('NewTeacher2'), 'Comment2'),
			]),
		);
	});
});
