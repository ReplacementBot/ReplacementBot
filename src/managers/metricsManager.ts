import ReplacementBot from '../replacementBot';
import io from '@pm2/io';

export default class MetricsManager
{
	public start(bot: ReplacementBot): void
	{
		io.metric({
			name: 'Total Guilds',
			value: () =>
			{
				return bot.guilds.cache.size;
			}
		});

		io.metric({
			name: 'Total Users',
			value: () =>
			{
				let result = 0;
				bot.guilds.cache.forEach((x) => result += x.memberCount);
				return result;
			}
		});

		io.metric({
			name: 'Total Replacement Channels',
			value: () =>
			{
				return bot.replacementsChannelsManager.findAllChannels().size;
			}
		});
	}
}
