import chalk from 'chalk';

export default class TestUtilities
{
	static commandPrefix = 'replacement-test!';

	public static getTestGuildId(): string
	{
		return process.env.REPLACEMENT_BOT_TEST_GUILD;
	}

	public static getRunType(): TestRunType
	{
		const guildEnvPresent = process.env.REPLACEMENT_BOT_TEST_GUILD != undefined;
		const tokenEnvPresent = process.env.REPLACEMENT_BOT_TEST_TOKEN != undefined;
		const dry = !guildEnvPresent || !tokenEnvPresent;
		const ci = process.env.CI != undefined;

		if(dry && ci)
		{
			return new TestRunType(TestRunTypeEnum.CI_DRY);
		}
		else if(!dry && ci)
		{
			return new TestRunType(TestRunTypeEnum.CI_FULL);
		}
		else if(dry && !ci)
		{
			return new TestRunType(TestRunTypeEnum.LOCAL_DRY);
		}
		else if(!dry && !ci)
		{
			return new TestRunType(TestRunTypeEnum.LOCAL_FULL);
		}
	}

	public static generateFetcherConfig(fetcherName: string, config: object): string
	{
		const result = {} as any;
		result.fetcher = {} as any;
		result.fetcher.name = fetcherName;
		result.fetcher.config = config;
		return JSON.stringify(result);
	}

	public static isRunningInTest(): boolean
	{
		return process.env.NODE_ENV === 'test';
	}
}

export class TestRunType
{
	type: TestRunTypeEnum;

	constructor(type: TestRunTypeEnum)
	{
		this.type = type;
	}

	public toString(): string
	{
		switch(this.type)
		{
		case TestRunTypeEnum.LOCAL_FULL:
			return chalk.green('These tests was run in FULL mode');
		case TestRunTypeEnum.LOCAL_DRY:
			return chalk.red.bold('Warning: These tests was run in DRY mode, Please configure ReplacementBot for full system testing!');
		case TestRunTypeEnum.CI_FULL:
			return chalk.green('These tests was run inside CI in FULL mode');
		case TestRunTypeEnum.CI_DRY:
			return chalk.yellow.bold('Warning: These tests was run inside CI in DRY mode');
		}
	}

	public isFull(): boolean
	{
		return this.type == TestRunTypeEnum.CI_FULL || this.type == TestRunTypeEnum.LOCAL_FULL;
	}

	public isDry(): boolean
	{
		return !this.isFull();
	}
}

export enum TestRunTypeEnum
{
	LOCAL_FULL = 0,
	LOCAL_DRY = 1,
	CI_FULL = 2,
	CI_DRY = 3,
}
