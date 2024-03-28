import dotenv from "dotenv"
import path from "path"
import type { Knex } from "knex"
dotenv.config({ path: path.join(__dirname + "/../.env") });

const config: { [key: string]: Knex.Config } = {
	test: {
		client: "pg",
		connection: process.env.DATABASE_CONNECTION_STRING + "/postgres",
		searchPath: ["application"],
		pool: { min: 0, max: 10 },
		migrations: {
			tableName: "knex_migrations",
			schemaName: "public",
			directory: "./database/migrations",
			extension: "js",
		},
		seeds: {
			directory: "./database/seeds/nonprod",
		},
	},
	development: {
		client: "pg",
		connection: process.env.DATABASE_CONNECTION_STRING + "/" + process.env.DATABASE,
		searchPath: ["application"],
		pool: { min: 0, max: 10 },
		migrations: {
			tableName: "knex_migrations",
			schemaName: "public",
			directory: "./database/migrations",
			extension: "js",
		},
		seeds: {
			directory: "./database/seeds/nonprod",
		},
		// debug: true
	},
	nonprod: {
		client: "pg",
		connection: process.env.DATABASE_CONNECTION_STRING + "/" + process.env.DATABASE,
		searchPath: ["application"],
		pool: { min: 0, max: 10 },
		migrations: {
			tableName: "knex_migrations",
			schemaName: "public",
			directory: "./database/migrations",
			extension: "js",
		},
		seeds: {
			directory: "./database/seeds/nonprod",
		},
	},
	prod: {
		client: "pg",
		connection: process.env.DATABASE_CONNECTION_STRING + "/" + process.env.DATABASE,
		searchPath: ["application"],
		pool: { min: 0, max: 10 },
		migrations: {
			tableName: "knex_migrations",
			schemaName: "public",
			directory: "./database/migrations",
			extension: "js",
		},
		seeds: {
			directory: "./database/seeds/prod",
		},
	},
}

module.exports = config
