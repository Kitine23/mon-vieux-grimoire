import { UserModel } from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { ValidationError } from "../utils/errors.js"

class UserController {
  /**
   * Auth signup Controller action
   * @param {Request} req
   * @param {Response} res
   * @description Auth create user
   * @route POST /api/auth/signup
   */
  static signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
      throw new ValidationError("Missing email for password in body")

    const hash = await bcrypt.hash(password, 10)

    const UserObject = new UserModel({
      email,
      password: hash,
    })
    await UserObject.save()

    res.status(201).json({ message: "created" })
  })

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ValidationError("Missing email for password in body")
    }

    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      res.json({ message: `invalid email or password` })
      return
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.json({ message: `invalid email or password` })
      return
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "24h",
    })

    res.json({ userId: user._id, token })
  })
}

export default UserController
