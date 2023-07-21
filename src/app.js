import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db.js"
import bookRouter from "./routes/books.js"
import authRouter from "./routes/auth.js"

dotenv.config()

const app = express()
connectDB()

// middleware
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cors())
app.use(express.static("./public"))

// routes
app.use("/api/auth", authRouter)
app.use("/api/books", bookRouter)

export { app }
