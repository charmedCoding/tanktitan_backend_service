import request from "supertest"
import { app } from "../src/index"
import { describe, expect, test } from "@jest/globals"

const allExamples = [
	{
		id: 1,
		title: "Example 1",
		description: "This is Example 1",
		secret_phrase: "gS3oevhReBaR7Rj6YsdOva5cS",
		weather: "sunny",
		public: false,
	},
	{
		id: 2,
		title: "Example 2",
		description: null,
		secret_phrase: "cDiRGlr6vDvAgkA6vNtxce4UV",
		weather: "rainy",
		public: true,
	},
]

const newExample = {
	title: "Example 3",
	description: "This is Example 3",
	weather: "cloudy",
}

describe("CRUD operations 'Example'", () => {
	test("GET /examples", async () => {
		await request(app)
			.get("/api/examples")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(expect.arrayContaining(allExamples))
			})
	})

	test("GET /examples/{id}", async () => {
		await request(app).get("/api/examples/0").expect("Content-Type", /json/).expect(404)

		await request(app)
			.get("/api/examples/1")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(allExamples[0])
			})
	})

	test("CREATE /examples", async () => {
		await request(app)
			.post("/api/examples")
			.send({ id: 0, ...newExample })
			.expect("Content-Type", /json/)
			.expect(422)

		await request(app)
			.post("/api/examples")
			.send(newExample)
			.expect("Content-Type", /json/)
			.expect(201)
			.then((response) => {
				expect(response.body).toEqual(expect.objectContaining({ id: 3, ...newExample }))
			})
	})

	test("PUT /examples/{id}", async () => {
		await request(app)
			.put("/api/examples/0?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.send(newExample)
			.expect("Content-Type", /json/)
			.expect(404)

		await request(app)
			.put("/api/examples/1?secretPhrase=WRONG")
			.send(newExample)
			.expect("Content-Type", /json/)
			.expect(401)

		await request(app)
			.put("/api/examples/1?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.send({ id: 0, ...newExample })
			.expect("Content-Type", /json/)
			.expect(422)

		await request(app)
			.put("/api/examples/1?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.send(newExample)
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(expect.objectContaining({ id: 1, ...newExample }))
			})
	})

	test("PATCH /examples/{token}/publish", async () => {
		await request(app)
			.patch("/api/examples/0/publish?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.expect("Content-Type", /json/)
			.expect(404)

		await request(app)
			.patch("/api/examples/1/publish?secretPhrase=WRONG")
			.expect("Content-Type", /json/)
			.expect(401)

		await request(app)
			.patch("/api/examples/2/publish?secretPhrase=cDiRGlr6vDvAgkA6vNtxce4UV")
			.expect("Content-Type", /json/)
			.expect(409)
			.then((response) => {
				expect(response.body).toEqual({
					errorType: "ConflictError",
					message: "Example already published",
				})
			})

		await request(app)
			.patch("/api/examples/1/publish?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(expect.objectContaining({ id: 1, public: true }))
			})
	})

	test("DELETE /examples/{id}", async () => {
		await request(app)
			.delete("/api/examples/0?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS")
			.expect("Content-Type", /json/)
			.expect(404)

		await request(app).delete("/api/examples/1?secretPhrase=WRONG").expect("Content-Type", /json/).expect(401)

		await request(app).delete("/api/examples/1?secretPhrase=gS3oevhReBaR7Rj6YsdOva5cS").expect(204)
	})
})
