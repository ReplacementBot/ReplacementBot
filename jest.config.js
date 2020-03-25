// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: 'ts-jest',

	clearMocks: true,

	globalSetup: './tests/util/setup.ts',
	globalTeardown: './tests/util/teardown.ts',

	reporters: ['default', 'jest-junit'],

	testEnvironment: 'node',
};
