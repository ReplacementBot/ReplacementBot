import { SystemTestsManager } from './systemTestsManager';

module.exports = (): void =>
{
	new SystemTestsManager().clear();
};
