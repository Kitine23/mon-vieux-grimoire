import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js'
import { BookModel } from './models/Book.js'
import uploads from './middlewares/uploads.js'

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

app.post('/api/auth/signup', (req, res) => {
  res.json('succès')
})

app.post('/api/auth/login', (req, res) => {
  res.json('succès!')
})

app.get('/api/books', async (req, res) => {
  const books = await BookModel.find()
  res.json(books)
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

app.get('/api/books/bestrating', async (req, res) => {
  res.json('succès!')
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

app.delete('/api/books/:id', (req, res) => {
  res.json('succès!')
})

app.post('/api/books/:id/rating', (req, res) => {
  res.json('succès!')
})

export { app }
