const express = require('express')
const app = express();
const router = require("./routes/router")
const cors = require("cors")
require("dotenv").config();

const port = 5000


app.use(express.json())//parses the data from the front end in form of json

app.use(cors())//to seitch domain in front end and back end because both have diffrent ports
app.use(router)

app.listen(port , ()=> {
    console.log(`server start at port no : ${port}.`)
})