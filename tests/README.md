# ReplacementBot Testing ✅
![CircleCI Master](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot?label=master&logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)
[![codecov](https://codecov.io/gh/MrBartusek/ReplacementBot/branch/master/graph/badge.svg?token=ONXF6BONI4)](https://codecov.io/gh/MrBartusek/ReplacementBot)

ReplacementBot uses [Jest](https://jestjs.io) for Testing.

### Running tests

You can locally run test via `npm test` command

Additionally, every master commit and PRs are tested in the cloud by CircleCi

### Configuration for Running Tests Locally

To run test locally you need additional configuration
1. Create second Bot in [Discord Developer Portal](https://discordapp.com/developers/applications/)
2. Create new Guild that will be used only for Tests. 
3. Add bot to Guild and give it `Administrator` permissions. You can use [Permissions Calculator](https://discordapi.com/permissions.html#8)
4. Copy ID of the guild - [Guide](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID)
5. Setup Environment Variables

Environment Variables:
- `REPLACEMENT_BOT_TEST_TOKEN` - Test Bot Token **Be sure to use Token of Test Version of the Bot!**
-  `REPLACEMENT_BOT_TEST_GUILD` - Test Guild ID that you created

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
	test('should ping bot', (done) => new SystemTest('ping', 'Pinging...', done));
});
```

System test framework custom made to match ReplacementBot need to check bot's responses to commands. Use of that framework simplifies system testing to write that small constructor in every system test.

