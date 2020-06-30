import ReplacementDay from './replacementDay';
import { Moment } from 'moment';

export interface ReplacementsFetcher
{
	initialize?(config: any): Promise<void>;
	fetchReplacements(date: Moment): Promise<ReplacementDay>;
}
