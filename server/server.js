import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/connectDB.js"

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    connectDB()
})