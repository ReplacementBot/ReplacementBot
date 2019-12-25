class Replacement
{
	constructor(lessonName, description, teacher, comments)
	{
		this.lessonName = lessonName;
		this.description = description;
		this.teacher = teacher;
		this.comments = comments;
	}
}
Replacement.prototype.toString = function()
{
	let result = '**[' + this.lessonName + ']** ' + this.description;
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