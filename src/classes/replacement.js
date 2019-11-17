class Replacement
{
	constructor(lesson, description, teacher, comments)
	{
		this.lesson = lesson;
		this.description = description;
		this.teacher = teacher;
		this.comments = comments;
	}
}
Replacement.prototype.toString = function()
{
	let result = '**[' + this.lesson + ']** ' + this.description;
	if(this.teacher != undefined)
	{
		result += ' | ' + this.teacher;
	}
	if(this.comments != undefined)
	{
		result += ' | ' + this.comments;
	}
	return result;
};
module.exports = Replacement;