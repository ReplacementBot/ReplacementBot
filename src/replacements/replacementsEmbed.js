const { RichEmbed } = require('discord.js');
const ReplacementsList = require('../classes/replacementsList');
const Replacement = require('../classes/replacement');
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class ReplacementsEmbed extends RichEmbed
{
	constructor(replacementsData, IsStaticEmbed)
	{
		super();
		this._createEmbedBase(IsStaticEmbed);

		if(replacementsData instanceof ReplacementsList)
		{
			this._createFieldsFromList(replacementsData);
		}
		else if(replacementsData instanceof Array && isReplacementsArray(replacementsData))
		{
			this._createFieldsFromList(replacementsData);
		}
	}
	static isEmbedUpdateNeeded(embedA, embedB)
	{
		for (let index = 0; index < embedA.fields.length; index++)
		{
			if(embedA.fields[index].name != embedB.fields[index].name) return false;
			if(embedA.fields[index].value != embedB.fields[index].value) return false;
		}

		if(embedA.author == embedB.author &&
				embedA.color == embedB.color &&
				embedA.description == embedB.description &&
				embedA.title == embedB.title)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

ReplacementsEmbed.prototype._createEmbedBase = function(IsStaticEmbed)
{
	this.setColor('DARK_VIVID_PINK');
	this.setThumbnail('https://cdn.pixabay.com/photo/2019/08/11/18/50/icon-4399684_960_720.png');

	const footerDate = new Date();
	this.setFooter((
		IsStaticEmbed ? 'Updated on: ' : 'Generated on: ')
	+ daysOfWeek[footerDate.getDay()] + ' '
	+ (footerDate.getHours() < 10 ? '0' : '') + footerDate.getHours() + ':'
	+ (footerDate.getMinutes() < 10 ? '0' : '') + footerDate.getMinutes(),
	);
};
ReplacementsEmbed.prototype._createFieldsFromList = function(list)
{
	this.setTitle('Replacements for class ' + global.config.get('class'));
	for (const day of list.getList())
	{
		const replacements = day.replacements;
		let replacementsList = '';
		for (let replacementsIndex = 0; replacementsIndex < replacements.length; replacementsIndex++)
		{
			if(replacementsIndex > 0)
			{
				replacementsList += '\n';
			}
			replacementsList += replacements[replacementsIndex].toString();
		}
		if(replacementsList == '')
		{
			replacementsList = ':x: No replacements for this class on this day';
		}
		this.addField('Replacements for ' + daysOfWeek[day.date.getDay()], replacementsList);
	}
};
ReplacementsEmbed.prototype._createFieldFromArray = function(array)
{
	this.setTitle('Replacements for class ' + global.config.get('class'));
};

function isReplacementsArray(array)
{
	array.every((element) => typeof element === Replacement);
}

module.exports = ReplacementsEmbed;