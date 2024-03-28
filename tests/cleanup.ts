import { db } from "../src/services/DatabaseService"

export default async function teardown() {
	await db.raw(
		"DROP SCHEMA IF EXISTS application CASCADE; DROP TABLE IF EXISTS public.knex_migrations; DROP TABLE IF EXISTS public.knex_migrations_lock;"
	)
	await db.destroy()
}
