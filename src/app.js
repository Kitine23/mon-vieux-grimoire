import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js'
import { BookModel } from './models/Book.js'
import uploads from './middlewares/uploads.js'
import { UserModel } from './models/User.js'

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

app.post('/api/auth/signup', async (req, res) => {
  const user = req.body
  try {
    const UserObject = new UserModel(user)
    await UserObject.save()
  } catch (error) {
    console.error(error)
    res.status(422).json({ message: 'validation error' })
  }

  res.status(201).json({ message: 'created' })
})

app.post('/api/auth/login', async (req, res) => {
  let user
  const { email, password } = req.body
  try {
    user = await UserModel.findOne({ email, password }).exec()
    if (!user) return res.status(401).json({ message: 'wrong credentials' })
  } catch (error) {
    console.error(error)
    res.status(422).json({ message: 'validation error' })
  }

  res.json({ userId: user._id, token: 'dev' })
})

app.get('/api/books', async (req, res) => {
  const books = await BookModel.find()
  res.json(books)
})

app.get('/api/books/bestrating', async (req, res) => {
  const threeBestAverageNoteBooks = await BookModel.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .exec()

  res.json(threeBestAverageNoteBooks)
})

app.get('/api/books/:id', async (req, res) => {
  let book = null
  try {
    book = await BookModel.findById(req.params.id).exec()
    console.log(book)
  } catch (error) {
    console.error(error)
    res.status(404).json('not found')
    return
  }

  res.json(book)
})

app.post('/api/books', uploads, async (req, res) => {
  let book = JSON.parse(req.body.book)
  delete book._id
  delete book._userId
  book.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
  }`

  console.log(book)

  try {
    const BookObject = new BookModel(book)
    await BookObject.save()
  } catch (error) {
    console.error(error)
    res.status(422).json({ message: 'validation failed' })
    return
  }

  res.status(201).json({ message: 'created' })
})

app.put('/api/books/:id', (req, res) => {
  res.json('succès!')
})

app.delete('/api/books/:id', async (req, res) => {
  try {
    await BookModel.deleteOne({ _id: req.params.id })
  } catch (error) {
    console.error(error)
    res.status(404).json({ message: 'not found' })
    return
  }
  res.json({ message: 'deleted' })
})

app.post('/api/books/:id/rating', async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id)
    book.ratings.push(req.body)
    const BookObject = new BookModel(book)
    await BookObject.save()
  } catch (error) {
    console.error(error)
    res.status(422).json({ message: 'validation error' })
  }
  res.json(book)
})

export { app }
