import { BookModel } from '../models/Book.js'
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
    const book = await BookModel.findOne({ _id: req.params.id })
    if (!book) {
      res.status(404).json({ message: 'not found' })
      return
    }

    if (book.userId !== req.auth.userId) {
      res.status(401).json({ message: 'not authorized' })
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
      const book = await BookModel.findById(req.params.id)
      book.ratings.push(req.body)
      const BookObject = new BookModel(book)
      await BookObject.save()
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation error' })
    }
    res.status(204).json(book)
  }
}

export default BookController
