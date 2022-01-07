let projectData = {}

const express = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("website"))

const port = 8000;
app.listen(port, () => {
    console.log(`app is listening on port :${port}`)
})

app.post("/feeling", (req, res) => {
    projectData = { ...req.body }
})

app.get("/all", (req, res) => {
    res.send(projectData)
})