import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"
import connectDB from "./config/db.js"
import bookRouter from "./routes/booksRoutes.js"
import authRouter from "./routes/authRoutes.js"

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

app.use(notFound)
app.use(errorHandler)

export { app }
