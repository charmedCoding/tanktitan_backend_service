// This is just an example of a migration file, create a new one instead of editing this one to avoid problems!

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createSchema("application").createTable("user", (table) => {
		table.increments("id")
		table.string("email", 50).notNullable()
		table.string("password").nullable()
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {}
