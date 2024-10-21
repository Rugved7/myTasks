import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/connectDB.js"

dotenv.config()
const app = express()

// Routes
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"



// middlewares
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use("/api/v1/users", authRoutes)


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    connectDB()
})