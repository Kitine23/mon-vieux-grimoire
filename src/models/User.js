import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

UserSchema.plugin(uniqueValidator)

export const UserModel = mongoose.model('User', UserSchema)
