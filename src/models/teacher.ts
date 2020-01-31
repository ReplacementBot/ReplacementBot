export default class Teacher
{
    // this is an string array cause it should contain only
    // one word per element example: [Fred, Newman]
    name: string[];

    constructor(name: string[])
    {
        this.name = name;
    }
    toString() 
    {
        return this.name.toString();
    }
}