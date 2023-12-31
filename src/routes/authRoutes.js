import express from "express"
import UserController from "../controllers/UserController.js"

const authRouter = express.Router()
authRouter.post("/signup", UserController.signup)
authRouter.post("/login", UserController.login)

export default authRouter
