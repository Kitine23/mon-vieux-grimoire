import { BookModel } from '../models/Book.js'
import { average } from '../utils/arrays.js'
import { deleteUpload } from '../utils/files.js'
import { getHost } from '../utils/urls.js'

class BookController {
  static async getAll(req, res) {
    const books = await BookModel.find().lean().exec()
    res.json(
      books.map((book) => ({
        ...book,
        imageUrl: getHost(req) + book.imageUrl,
      }))
    )
  }

  static async getBestRated(req, res) {
    const threeBestAverageNoteBooks = await BookModel.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .exec()

    res.json(threeBestAverageNoteBooks)
  }

  static async getById(req, res) {
    try {
      const book = await BookModel.findById(req.params.id).lean().exec()
      res.json({
        ...book,
        imageUrl: getHost(req) + book.imageUrl,
      })
    } catch (error) {
      console.error(error)
      res.status(404).json('not found')
    }
  }

  static async createOne(req, res) {
    let book = JSON.parse(req.body.book)
    const imageUrl = req.image.filename

    try {
      const BookObject = new BookModel({
        ...book,
        userId: req.auth.userId,
        imageUrl,
      })
      await BookObject.save()
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation failed' })
      return
    }

    res.status(201).json({ message: 'created' })
  }

  static async updateById(req, res) {
    const { userId } = BookModel.findById(req.params.id)
    if (req.auth?.userId !== userId) {
      res.status(403).json('403: unauthorized request')
      return
    }

    let book = req.body.book ? JSON.parse(req.body.book) : req.body

    if (req?.image?.filename) {
      // new image ? we delete previous one
      const { imageUrl } = await BookModel.findById(req.params.id).lean().exec()
      deleteUpload(imageUrl)
      // add new filename
      book.imageUrl = req.image.filename
    }

    try {
      await BookModel.updateOne({ _id: req.params.id }, book)
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation failed' })
      return
    }

    res.status(204).json({ message: 'updated' })
  }

  static async deleteById(req, res) {
    const book = await BookModel.findById(req.params.id)
    if (!book) {
      res.status(404).json({ message: 'not found' })
      return
    }

    if (book.userId !== req.auth.userId) {
      res.status(403).json('403: unauthorized request')
      return
    }

    try {
      await BookModel.deleteOne({ _id: req.params.id })
      deleteUpload(book.imageUrl)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'server error' })
      return
    }
    res.status(204).json({ message: 'deleted' })
  }

  static async addRatingById(req, res) {
    try {
      const { userId, rating } = req.body
      if (rating < 0 || rating > 5)
        throw new Error('rating must be between 0 and 5')

      const book = await BookModel.findById(req.params.id)
      if (book.ratings.find((r) => r.userId === userId)) {
        throw new Error('cannot rate a book twice')
      }

      book.ratings.push({
        userId,
        grade: rating,
      })
      book.averageRating = average(book.ratings.map((rating) => rating.grade))

      const BookObject = new BookModel(book)
      await BookObject.save()
      res.status(204).json(book)
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation error' })
    }
  }
}

export default BookController
