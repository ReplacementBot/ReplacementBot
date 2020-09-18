import moment from 'moment';
import URLFormatter from '../../src/util/URLFormatter';

describe('URLFormatter', () =>
{
	test('should not modify url without arguments', async () =>
	{
		expect(URLFormatter.formatUrl('http://example.com', moment())).toBe('http://example.com');
	});

	test('should replace `moment` variable', async () =>
	{
		expect(URLFormatter.formatUrl('http://example.com/{moment(YYYY)}', moment())).toBe('http://example.com/' + moment().format('YYYY'));
	});

	test('should replace `random` variable', async () =>
	{
		const result = URLFormatter.formatUrl('http://example.com/{random()}', moment());
		const num = Number(result.replace('http://example.com/', ''));
		expect(num).toBeGreaterThan(0);
		expect(num).toBeLessThan(1001);
	});

	test('should throw error on unknown variable', async () =>
	{
		expect(() =>
		{
			URLFormatter.formatUrl('http://example.com/{unknown()}', moment());
		}).toThrow('Unknown URLFormatter variable "unknown()"');
	});
});
