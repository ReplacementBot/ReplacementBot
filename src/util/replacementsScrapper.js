const axios = require('axios');
const cheerio = require('cheerio');
const iso88592 = require('iso-8859-2');
const Replacement = require('../classes/replacement');

module.exports = {
	getReplacements: async function(date)
	{
		return new Promise(function(resolve, reject)
		{
			const url = getRequestURL(date);
			if(url == '')
			{
				reject('Bad date format');
				return;
			}
			axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' })
				.then(response =>
				{
					const parsedData = praseResult(response);
					const result = [];

					// foreach each row
					parsedData('tr').each(function()
					{
						if(parsedData(this).children().length < 2) return true;
						if(!parsedData(this).children('td').eq(1).text().includes(global.config.get('class'))) return true;

						let lesson, description, teacher, comments;

						// foreach each cell
						parsedData(this).children('td').each(function(index)
						{
							const text = parsedData(this).text().replace(/\r?\n|\r/g, '');
							// \xa0 is a hard space (empty row)
							if(text == '\xa0') return false;
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
						result.push(new Replacement(lesson, description, teacher, comments));
					});
					resolve(result);
				})
				.catch(error =>
				{
					if(error.response)
					{
						reject(error.response.status);
					}
					else
					{
						reject(0);
					}
				});
		});
	},
};
function getRequestURL(date)
{
	if(!(date instanceof Date)) return '';

	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if(day < 10)
	{
		day = '0' + day;
	}
	if(month < 10)
	{
		month = '0' + month;
	}
	return global.config.get('replacementsUrl') +
	year + '_' + month + '_' + day + '.html';
}
function praseResult(response)
{
	response.data = iso88592.decode(response.data.toString('binary'));
	return cheerio.load(response.data);
}