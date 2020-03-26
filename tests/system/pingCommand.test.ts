import { SystemTest } from '../util/systemTest';
declare function fail(error?: any): never;

describe('Ping Command', () =>
{
	test('should ping bot', (done) => new SystemTest('ping', 'Pinging...', done));
});

