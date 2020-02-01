import { ReplacementsFetcher, FetcherType } from '../models/replacementsFetcher';
import Replacement from '../models/replacement';
import Lesson from '../models/lesson';

export default class DummyFetcher implements ReplacementsFetcher
{
	type = FetcherType.ONE_DAY;
	public fetchReplacements(): Promise<Replacement[]>
	{
		return new Promise((resolve, reject) =>
		{
			const lesson = new Lesson('Dummy Lesson', 0);
			resolve([new Replacement(lesson, 'Dummy')]);
		});
	}
}