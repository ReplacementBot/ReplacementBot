import { ReplacementsFetcher } from '../models/replacementsFetcher';
import Replacement from '../models/replacement';
import Lesson from '../models/lesson';
import ReplacementDay from '../models/replacementDay';
import moment from 'moment';
import TestUtilities from '../../tests/util';

export default class TestFetcher implements ReplacementsFetcher
{
	initialized = false;
	public initialize(config: any): Promise<void>
	{
		if(TestUtilities.isRunningInTest())
		{
			this.initialized = true;
			return Promise.resolve();
		}
		else
		{
			return Promise.reject(new Error('TestFetcher cannot be initialized outside tests'));
		}
	}
	public fetchReplacements(date: moment.Moment): Promise<ReplacementDay>
	{
		if(process.env.TEST_FETCHER_FAIL === 'error')
		{
			return Promise.reject(new Error('Triggered Fail'));
		}
		else
		{
			const replacement = new ReplacementDay(date, [ new Replacement(new Lesson(0, 'Test'), 'initialized: ' + this.initialized)]);
			return Promise.resolve(replacement);
		}
	}
}
