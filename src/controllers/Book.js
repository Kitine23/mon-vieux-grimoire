import { BookModel } from '../models/Book.js'

class BookController {
  static async getAll(req, res) {
    const books = await BookModel.find()
    res.json(books)
  }

  static async getBestRated(req, res) {
    const threeBestAverageNoteBooks = await BookModel.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .exec()

    res.json(threeBestAverageNoteBooks)
  }

  static async getById(req, res) {
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
  }

  static async createOne(req, res) {
    let book = JSON.parse(req.body.book)
    delete book._id
    delete book._userId
    book.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`

    try {
      const BookObject = new BookModel(book)
      await BookObject.save()
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation failed' })
      return
    }

    res.status(201).json({ message: 'created' })
  }

  static async updateById(req, res) {
    res.json('succès!')
  }

  static async deleteById(req, res) {
    try {
      await BookModel.deleteOne({ _id: req.params.id })
    } catch (error) {
      console.error(error)
      res.status(404).json({ message: 'not found' })
      return
    }
    res.json({ message: 'deleted' })
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
    res.json(book)
  }
}

export default BookController
