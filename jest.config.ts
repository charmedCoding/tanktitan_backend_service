import type { Config } from "jest"

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
	},
	transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
	globalTeardown: "./tests/cleanup.ts",
	// setupFilesAfterEnv: ['./tests/cleanup.ts'],
}

export default config
