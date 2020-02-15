import { ReplacementsFetcher, FetcherType } from '../models/replacementsFetcher';
import Replacement from '../models/replacement';
import Lesson from '../models/lesson';
import ReplacementDay from '../models/replacementDay';
import moment from 'moment';

export default class DummyFetcher implements ReplacementsFetcher
{
	type = FetcherType.MULTIPLE_DAYS;
	public fetchReplacements(date?: moment.Moment): Promise<ReplacementDay>
	{
		return new Promise((resolve, reject) =>
		{
			const lesson = new Lesson('Dummy Lesson', 0);
			resolve(new ReplacementDay(date, [ new Replacement(lesson, 'Dummy') ]));
		});
	}
}
