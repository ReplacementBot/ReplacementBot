import { ReplacementsFetcher } from '../models/replacementsFetcher';
import Replacement from '../models/replacement';
import Lesson from '../models/lesson';
import ReplacementDay from '../models/replacementDay';
import moment from 'moment';

export default class DummyFetcher implements ReplacementsFetcher
{
	public fetchReplacements(date?: moment.Moment): Promise<ReplacementDay>
	{
		return new Promise((resolve, reject) =>
		{
			const lesson = new Lesson(0, 'Dummy Lesson');
			resolve(new ReplacementDay(date, [ new Replacement(lesson, 'Dummy') ]));
		});
	}
}
