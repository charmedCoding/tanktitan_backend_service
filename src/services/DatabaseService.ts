import { Knex } from "knex"
const knexConfig = require("../knexfile")

let env = process.env.NODE_ENV || "development"
let config = knexConfig[env]

export const db: Knex = require("knex")(config)
