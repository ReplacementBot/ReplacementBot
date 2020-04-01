import { SystemTest, SystemTestType } from '../testUtil/systemTest';

describe('Ping Command', () =>
{
	test('should ping bot', () =>
	{
		if(SystemTest.shouldSkip()) return;
		return expect(new SystemTest().runTest('ping', SystemTestType.EXPECT_EDIT)).resolves.toContain('The average heartbeat ping is');
	});
});

