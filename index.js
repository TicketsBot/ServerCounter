// Imports
const express = require('express')
const fs = require('fs')
const toml = require('toml')
const bodyParser = require('body-parser')

// Util functions
function isInt(str) {
    return !(isNaN(parseInt(str)))
}

function toInt(str) {
    return parseInt(str)
}

// Load config
const config = toml.parse(fs.readFileSync('config.toml'))

// Create app + middleware
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

var serverCounts = new Array()

// Add routes
app.get('/total', (req, res) => {
    res.send(serverCounts.reduce((a, b) => a + b, 0).toString())
})

app.post('/update', (req, res) => {
    if (req.body.key != config.server.key) {
        res.statusCode = 403
        res.send('Invalid API key')
        return
    }

    var shard = req.body.shard
    var serverCount = req.body.serverCount

    if (!isInt(shard) || !isInt(serverCount)) {
        res.statusCode = 400
        res.send('Invalid request')
        return
    }

    serverCounts[toInt(shard)] = toInt(serverCount)

    res.statusCode = 200
    res.send('Success')
})

// Listen for connections
var host = config.server.host
var port = config.server.port

app.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`)
})
