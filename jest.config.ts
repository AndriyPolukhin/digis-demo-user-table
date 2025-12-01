import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',

	// Setup files
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	// Module name mapper for path aliases
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},

	// Test match patterns
	testMatch: [
		'**/__tests__/**/*.test.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
	],

	// Coverage configuration
	collectCoverageFrom: [
		'components/**/*.{js,jsx,ts,tsx}',
		'lib/**/*.{js,jsx,ts,tsx}',
		'app/**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/.next/**',
		'!**/coverage/**',
	],

	// Transform ignore patterns
	transformIgnorePatterns: [
		'/node_modules/',
		'^.+\\.module\\.(css|sass|scss)$',
	],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
