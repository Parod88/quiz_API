import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  maxWorkers: 1,
  forceExit: true,
};

export default config;
