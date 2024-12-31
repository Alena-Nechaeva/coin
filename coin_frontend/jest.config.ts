// https://jestjs.io/docs/configuration

import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './src',
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Include the setup file
  clearMocks: true, // Automatically clear mock calls, instances, and results before each test to ensure clean test isolation.
  collectCoverage: false, //Indicates whether code coverage information should be collected during tests.
  coverageDirectory: 'coverage', //Specify the directory where Jest should output coverage files
  coverageProvider: 'v8', // Indicates which code instrumentation provider should be used for coverage. Options: 'babel' | 'v8'
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'], //Specifies an array of file extensions for your modules
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Configures how Jest processes TypeScript files. Match `.ts` and `.tsx` files
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Maps @/ to the src/ directory
  },
  testEnvironment: 'jsdom', //Specifies the test environment.

  // Patterns Jest uses to detect test files.
  testMatch: [
    '**/__test__/**/*.[jt]s?(x)', // Matches files inside `__test__` folders
    '**/?(*.)+(spec|test).[tj]s?(x)', // Matches `*.spec.tsx` or `*.test.tsx`
  ],
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\', // Skip `node_modules` folder
  ],
  transformIgnorePatterns: [
    '\\\\node_modules\\\\', // Don't transform files in `node_modules`
    '\\.pnp\\.[^\\\\]+$', // Ignore `.pnp` files from Yarn Plug'n'Play
  ],
  notify: false, // Set to `true` if you want desktop notifications
  restoreMocks: true, //Automatically restore mock state and implementation before each test.
  verbose: false, //Activates verbose output for test results.
  testRunner: 'jest-circus/runner', // Use the Jest circus test runner, which is the default for modern Jest versions.
};

export default createJestConfig(customJestConfig);
