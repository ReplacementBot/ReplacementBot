export default class MiscHelpers
{
	public static isRunningInTest(): boolean
	{
		return process.env.JEST_WORKER_ID !== undefined;
	}

	public static getBotToken(): string
	{
		return this.isRunningInTest() ? process.env.REPLACEMENT_BOT_TEST_TOKEN : process.env.REPLACEMENT_BOT_TOKEN;
	}
}
