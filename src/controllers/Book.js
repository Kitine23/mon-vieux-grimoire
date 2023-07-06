import { BookModel } from '../models/Book.js'
import fs from 'node:fs'

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

    book.userId = req.auth.userId
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
    let book = req.body.book ? JSON.parse(req.body.book) : req.body

    if (req?.file?.filename) {
      book.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
        req.file.filename
      }`
    }

    try {
      await BookModel.updateOne({ _id: req.params.id }, book)
    } catch (error) {
      console.error(error)
      res.status(422).json({ message: 'validation failed' })
      return
    }

    res.json({ message: 'updated' })
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
      // suppression de l'image du livre
      const filename = book.imageUrl.split('/uploads/')?.[1]
      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) throw err
        console.log(`uploads/${filename} was deleted`)
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'server error' })
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
