module.exports = {
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	overrides: [],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"no-prototype-builtins": "off",
		"prettier/prettier": [
			"warn",
			{
				singleQuote: false,
				printWidth: 120,
				proseWrap: "always",
				tabWidth: 4,
				useTabs: true,
				trailingComma: "es5",
				bracketSpacing: true,
				semi: false,
				endOfLine: "auto",
			},
		],
	},
}
