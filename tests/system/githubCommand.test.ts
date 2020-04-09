import { SystemTest, SystemTestType } from '../testUtil/systemTest';

describe('Github Command', () =>
{
	test('should show repo link', () =>
	{
		if(SystemTest.shouldSkip()) return;
		return expect(new SystemTest().runTest('github', SystemTestType.EXPECT_MESSAGE)).resolves.toContain('Open Source');
	}, SystemTest.timeout);
});
