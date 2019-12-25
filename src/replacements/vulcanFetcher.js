const axios = require('axios');
const cheerio = require('cheerio');
const iso88592 = require('iso-8859-2');
const Replacement = require('../classes/replacement');
const ReplacemeentsList = require('../classes/replacementsList');
class VulcanFetcher
{ }

VulcanFetcher.prototype.fetchSingleDay = function(date)
{
	return new Promise(function(resolve, reject)
	{
		const url = validURL(date) ? date : getRequestURL(date);
		axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' })
			.then(response =>
			{
				resolve(convertTableToReplacements(praseResult(response)));
			})
			.catch(error =>
			{
				if(error.response)
				{
					reject(`Failed to fetch Vulcan Replacement | Code: ${error.response.status} | URL: ${url} | Error: ${error}`);
				}
				else
				{
					reject(`Failed to fetch Vulcan Replacement | Code: Unknown | URL: ${url} | Error: ${error}`);
				}
			});
	});
};
VulcanFetcher.prototype.fetchMultipleDays = function(dateArray)
{
	return new Promise((resolve, reject) =>
	{
		const result = new ReplacemeentsList();
		let index = 0;
		for (const date of dateArray)
		{
			this.fetchSingleDay(date)
				.then(response =>
				{
					index++;
					result.addDay(date, response);
					if(index === dateArray.length)
					{
						resolve(result);
					}
				});
		}
	});
};
function validURL(str)
{
	const pattern = new RegExp('^(https?:\\/\\/)?' +
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
		'((\\d{1,3}\\.){3}\\d{1,3}))' +
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
		'(\\?[;&a-z\\d%_.~+=-]*)?' +
		'(\\#[-a-z\\d_]*)?$', 'i');
	return !!pattern.test(str);
}
function convertTableToReplacements(parsedData)
{
	const replacements = [];
	parsedData('tr').each(function()
	{
		let lesson, description, teacher, comments;
		const row = parsedData(this);
		if(!isValidRow(row)) return true;
		if(!isGoodClassRow(row)) return true;

		row.children('td').each(function(index)
		{
			const cell = parsedData(this);
			const text = removeEndlineFromText(cell.text());
			switch(index)
			{
			case 0:
				lesson = text;
				break;
			case 1:
				description = text;
				break;
			case 2:
				teacher = text;
				break;
			case 3:
				comments = text;
				break;
			}
		});
		replacements.push(new Replacement(lesson, description, teacher, comments));
	});
	return replacements;
}
function removeEndlineFromText(text)
{
	return text.replace(/\r?\n|\r/g, '');
}
function isValidRow(row)
{
	return row.children().length > 1;
}
function isGoodClassRow(row)
{
	return row.children('td').eq(1).text().includes(global.config.get('class'));
}
function praseDate(date)
{
	if(date instanceof Date)
	{
		const year = date.getFullYear();
		const month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1;
		const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

		return year + '_' + month + '_' + day + '.html';
	}
	else
	{
		return date;
	}
}
function getRequestURL(date)
{
	return global.config.get('replacementsUrl') + praseDate(date);
}
function praseResult(response)
{
	response.data = iso88592.decode(response.data.toString('binary'));
	return cheerio.load(response.data);
}

module.exports = VulcanFetcher;