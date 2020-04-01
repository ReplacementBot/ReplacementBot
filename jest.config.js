// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: 'ts-jest',

	clearMocks: true,

	globalSetup: './tests/testUtil/setup.ts',
	globalTeardown: './tests/testUtil/teardown.ts',

	reporters: ['default', 'jest-junit'],

	testEnvironment: 'node',
};
