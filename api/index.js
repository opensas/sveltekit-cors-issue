const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: true }))

app.get('/', (req, res) => (res.json({ message: 'Hello World' })))

app.listen(2020, () => (console.log('server is listening on port 2020')))