module.exports = {
	apps:
	[{
		name: 'ReplacementBot',
		script: 'build/src/index.js',
		watch: 'build',
		max_memory_restart: '150M',
		wait_ready: true,
		max_restarts: 10,
		restart_delay: 10000,
	}]
};
