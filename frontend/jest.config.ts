// jest.config.ts

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",

  testEnvironment: "jsdom",

  roots: [
    "<rootDir>/tests",
  ],

  moduleNameMapper: {
    "^@/(.*)$":
      "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
  ],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/**/loading.tsx",
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
  ],

  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
  ],

  clearMocks: true,
};

export default config;