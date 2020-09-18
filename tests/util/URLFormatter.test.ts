import moment from 'moment';
import URLFormatter from '../../src/util/URLFormatter';

describe('URLFormatter', () =>
{
	test('should not modify url without arguments', async () =>
	{
		expect(URLFormatter.formatUrl('http://example.com')).toBe('http://example.com');
	});

	test('should replace `moment` variable', async () =>
	{
		expect(URLFormatter.formatUrl('http://example.com/{moment(YYYY)}')).toBe('http://example.com/' + moment().format('YYYY'));
	});

	test('should replace `random` variable', async () =>
	{
		const result = URLFormatter.formatUrl('http://example.com/{random()}');
		const num = Number(result.replace('http://example.com/', ''));
		expect(num).toBeGreaterThan(0);
		expect(num).toBeLessThan(1001);
	});

	test('should throw error on unknown variable', async () =>
	{
		expect(() =>
		{
			URLFormatter.formatUrl('http://example.com/{unknown()}');
		}).toThrow('Unknown URLFormatter variable "unknown()"');
	});
});
