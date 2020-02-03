import { ReplacementsFetcher, FetcherType } from '../models/replacementsFetcher';
import Replacement from '../models/replacement';
import Lesson from '../models/lesson';
import ReplacementDay from '../models/replacementDay';
import moment = require('moment');

export default class DummyFetcher implements ReplacementsFetcher
{
	type = FetcherType.ONE_DAY;
	public fetchReplacements(): Promise<ReplacementDay>
	{
		return new Promise((resolve, reject) =>
		{
			const lesson = new Lesson('Dummy Lesson', 0);
			resolve(new ReplacementDay(moment(), [ new Replacement(lesson, 'Dummy') ]));
		});
	}
}
