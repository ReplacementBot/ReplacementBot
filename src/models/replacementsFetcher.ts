import ReplacementDay from './replacementDay';
import moment = require('moment');
import Replacement from './replacement';

export enum FetcherType { ONE_DAY, MULTIPLE_DAYS}

export interface ReplacementsFetcher
{
    readonly type: FetcherType;

	fetchReplacements(date?: moment.Moment): Promise<ReplacementDay> | Promise<Replacement[]>;
}