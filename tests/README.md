# ReplacementBot Testing ✅
![CircleCI Master](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot?label=master&logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)
![CircleCI Develop](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot/develop?label=develop&logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)

ReplacementBot uses [Jest](https://jestjs.io) for Testing.

### Running tests

You can locally run test via `npm test` command

Additionally, every master commit and PRs are tested in the cloud by CircleCi

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

