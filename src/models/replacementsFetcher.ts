import ReplacementDay from './replacementDay';
import moment = require('moment');

export interface ReplacementsFetcher
{
	initialize?(config: any): Promise<void>;
	fetchReplacements(date: moment.Moment): Promise<ReplacementDay>;
}
