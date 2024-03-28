import { app } from "./index"

const port = process.env.PORT || 8081

app.listen(port, () => console.log(`Node Knex Template API listening at Port: ${port}`))
