class ReplacementsList
{
	constructor()
	{
		this.replacements = [];
	}
}
ReplacementsList.prototype.addDay = function(date, replacements)
{
	this.replacements.push({ 'date':date, 'replacements': replacements });
};
ReplacementsList.prototype.getList = function()
{
	return this.replacements;
};

module.exports = ReplacementsList;