import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
	await knex("user").insert([
		{
			email: "example@mail.com",
			password: "gS3oevhReBaR7Rj6YsdOva5cS",
			weather: "sunny",
		},
		{
			title: "example@gmail.com",
			password: "cDiRGlr6vDvAgkA6vNtxce4UV",
		},
	])
}
