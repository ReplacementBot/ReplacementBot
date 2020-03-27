# ReplacementBot Testing ✅
![CircleCI Master](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot?label=master&logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)
[![codecov](https://codecov.io/gh/MrBartusek/ReplacementBot/branch/master/graph/badge.svg?token=ONXF6BONI4)](https://codecov.io/gh/MrBartusek/ReplacementBot)

ReplacementBot uses [Jest](https://jestjs.io) for Testing and, [CircleCi](https://circleci.com) for Cloud Testing.

## Running tests

You can locally run test via `npm test` command after ReplacementBot Setup. If you want test to run in full mode (recommended) please read [Configuration Guide](#configuration-for-running-system-tests-locally)

Additionally, every commit and PRs are tested in the cloud by CircleCi. Hoverer, PRs from Forked Repositories are build in [Dry Mode](dry-and-full-mode)

## Configuration for Running System Tests Locally

To run test system tests locally you need additional configuration
1. Create second Bot in [Discord Developer Portal](https://discordapp.com/developers/applications/)
2. Create new Guild that will be used only for Tests. 
3. Add bot to Guild and give it `Administrator` permissions. You can use [Permissions Calculator](https://discordapi.com/permissions.html#8)
4. Copy ID of the guild - [Guide](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID)
5. Setup Environment Variables

Environment Variables:
- `REPLACEMENT_BOT_TEST_TOKEN` - Test Bot Token **Be sure to use Token of Test Version of the Bot!**
-  `REPLACEMENT_BOT_TEST_GUILD` - Test Guild ID that you created

## Dry and Full mode

In this project we are using 2 modes for building `DRY` and `FULL`. If possible, every test run should be full. Full mode runs all Unit Tests and System Tests. Dry mode runs only Unit Tests. 

The reason for that modes is CI Security. We cannot run System Tests on Untrusted PRs because, they are connecting to our Testing Bot Instancie.

To ensure that your PR will pass tests you should run it locally on your own Testing Bot Instancie, local tests should always be Full.
 

## Unit Tests

```ts
// logger.test.ts
describe('Logger', () =>
{
	test('should info', () =>
	{
		console.log = jest.fn();
		Logger.info('Test');
		expect(console.log).toHaveBeenCalledWith(chalk.bold.white('[INFO] ') + 'Test');
	});
```
These tests are used to test behavior of specific classes of the bot without need to connect to discord servers. Uses normal [Jest](https://jestjs.io) syntax

## System Tests

```ts
// pingCommand.test.ts
describe('Ping Command', () =>
{
	test('should ping bot', () =>
	{
		// Skip test if running in DRY mode
		if(SystemTest.shouldSkip()) return;

		return expect(new SystemTest().runTest('ping', SystemTestType.EXPECT_EDIT)).resolves.toContain('The average heartbeat ping is');
	});
});
```

System test framework custom made to match ReplacementBot need to check bot's responses to commands. Use of that framework simplifies system testing to write tests that small

