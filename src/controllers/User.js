import { UserModel } from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController {
  static async signup(req, res) {
    let hash
    try {
      hash = await bcrypt.hash(req.body.password, 10)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'cannot hash password' })
      return
    }

    try {
      const UserObject = new UserModel({
        email: req.body.email,
        password: hash,
      })
      await UserObject.save()
    } catch (error) {
      console.error(error)
      res
        .status(422)
        .json({ message: 'validation error', reason: error?.message })
      return
    }

    res.status(201).json({ message: 'created' })
  }

  static async login(req, res) {
    try {
      const email = req.body?.email
      const password = req.body?.password

      if (!email | !password) {
        throw `invalid email or password`
      }

      const user = await UserModel.findOne({ email }).exec()
      if (!user) {
        throw `invalid email or password`
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        throw `invalid email or password`
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
        expiresIn: '24h',
      })

      res.json({ userId: user._id, token })
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: error })
      return
    }
  }
}

export default UserController
