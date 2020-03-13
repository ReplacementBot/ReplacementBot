import { ReplacementsFetcher, FetchError, ResponseParseError } from '../models/replacementsFetcher';
import { Config } from '../managers/config';
import ReplacementDay from '../models/replacementDay';
import moment = require('moment');
import WebFetcher, { HTTPResponse } from '../util/webFetcher';
import cheerio from 'cheerio';
import FetchersHelper from '../util/fetcherHelper';
import Replacement from '../models/replacement';
import Logger from '../managers/logger';
import Lesson from '../models/lesson';
import Teacher from '../models/teacher';

enum RowFieldType
{
	LESSON,
	DESCRIPTION,
	NEW_TEACHER,
	COMMENTS,
}
export default class VulcanFetcher implements ReplacementsFetcher
{
	webFetcher: WebFetcher;

	constructor()
	{
		this.webFetcher = new WebFetcher();
	}

	fetchReplacements(date: moment.Moment): Promise<ReplacementDay | FetchError | ResponseParseError>
	{
		return new Promise((resolve, reject) =>
		{
			const config = Config.getInstance().get('fetchersConfiguration')['vulcanFetcher'];
			const url = FetchersHelper.formatURL(config, date);
			this.webFetcher.request(url, 'ISO-8859-2')
				.then((requestResult: HTTPResponse) =>
				{
					const data = cheerio.load(requestResult.result.replace(/\r?\n|\r/g, ''));
					const result = this.praseResult(data);
					if(result instanceof ResponseParseError)
					{
						reject(result);
					}
					else
					{
						resolve(new ReplacementDay(date, result));
					}

				})
				.catch((error: HTTPResponse) =>
				{
					if(error.statusCode == 404)
					{
						resolve(new ReplacementDay(date));
					}
					else
					{
						reject(new FetchError(error.toString()));
					}
				});
		});
	}

	private praseResult(data: CheerioStatic): Replacement[] | ResponseParseError
	{
		const result: Replacement[] = [];
		let currentTeacher: string;
		data('tr').each((index, row) =>
		{
			if(this.isPageTitleRow(index)) return true;
			if(this.isCategoryTitleRow(data, row))
			{
				if(this.isNotImportantCategoryTitleRow(data, row))
				{
					currentTeacher = undefined;
				}
				else
				{
					currentTeacher = data(row).children('td').first().text().trim();
				}
			}

			if(currentTeacher == undefined) return true;
			if(this.isCaptionRow(data, row)) return true;

			const lesson = new Lesson(Number(this.getFieldFromRow(data, row, RowFieldType.LESSON)));
			const description = this.getFieldFromRow(data, row, RowFieldType.DESCRIPTION);
			const replacedTeacher = new Teacher(currentTeacher);
			let comments: string;
			let newTeacher: Teacher;
			if(this.getFieldFromRow(data, row, RowFieldType.NEW_TEACHER).trim())
			{
				newTeacher = new Teacher(this.getFieldFromRow(data, row, RowFieldType.NEW_TEACHER));
			}
			if(this.getFieldFromRow(data, row, RowFieldType.COMMENTS).trim())
			{
				comments = this.getFieldFromRow(data, row, RowFieldType.COMMENTS);
			}

			result.push(new Replacement(lesson, description, replacedTeacher, newTeacher, comments));
		});
		return result;
	}

	private isPageTitleRow(index: number): boolean
	{
		return index === 0;
	}
	private isCategoryTitleRow(data: CheerioStatic, row: CheerioElement): boolean
	{
		return data(row).children('td').length === 1;
	}
	private isNotImportantCategoryTitleRow(data: CheerioStatic, row: CheerioElement): boolean
	{
		return data(row).children('td').first().text().includes('dyżury');
	}
	private isCaptionRow(data: CheerioStatic, row: CheerioElement): boolean
	{
		// First cell of every non-caption row is always number
		const firstCell = data(row).children('td').first().text().trim();
		if(isNaN(Number(firstCell)) || firstCell == '')
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	private getFieldFromRow(data: CheerioStatic, row: CheerioElement, fieldType: RowFieldType): string
	{
		let result: string;
		switch(fieldType)
		{
		case RowFieldType.LESSON:
			result = data(row).children('td').eq(0).text();
			break;
		case RowFieldType.DESCRIPTION:
			result = data(row).children('td').eq(1).text();
			break;
		case RowFieldType.NEW_TEACHER:
			result = data(row).children('td').eq(2).text();
			break;
		case RowFieldType.COMMENTS:
			result = data(row).children('td').eq(3).text();
			break;
		}
		if(result == '/&nbsp')
		{
			return undefined;
		}
		else
		{
			return result.trim();
		}
	}
}
