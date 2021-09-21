require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.raw())

app.use('/api/1.0', require('./api/routes'))

app.listen(PORT, () => {
    console.log('API lista por el puerto: ', PORT)
})