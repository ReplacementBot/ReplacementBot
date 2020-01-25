Date.prototype.addDays = function(days)
{
	const date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

module.exports.getDaysFetchingArray = function(daysCount)
{
	const result = [];
	for (let index = 0; index < daysCount; index++)
	{
		result[index] = new Date().addDays(index);
		result[index] = new Date(2019, 11, 19);
	}
	return result;
};