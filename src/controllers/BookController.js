import { BookModel } from "../models/BookModel.js"
import { average } from "../utils/arrays.js"
import { NotFoundError, ValidationError } from "../utils/errors.js"
import { deleteUpload } from "../utils/files.js"
import { getHost } from "../utils/urls.js"
import asyncHandler from "express-async-handler"

class BookController {
  static getAll = asyncHandler(async (req, res) => {
    const books = await BookModel.find().lean().exec()
    res.json(
      books.map((book) => ({
        ...book,
        imageUrl: getHost(req) + book.imageUrl,
      }))
    )
  })

  static getBestRated = asyncHandler(async (_req, res) => {
    const threeBestAverageNoteBooks = await BookModel.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .exec()

    res.json(threeBestAverageNoteBooks)
  })

  static getById = asyncHandler(async (req, res) => {
    const book = await BookModel.findById(req.params.id).lean().exec()
    if (!book) {
      throw new NotFoundError(`book n°${req.params.id} not found`)
    }

    res.json({
      ...book,
      imageUrl: getHost(req) + book.imageUrl,
    })
  })

  static createOne = asyncHandler(async (req, res) => {
    let book = JSON.parse(req.body.book)
    const imageUrl = req.image.filename

    const BookObject = new BookModel({
      ...book,
      userId: req.auth.userId,
      imageUrl,
    })
    await BookObject.save()

    res.status(201).json({ message: "created" })
  })

  static updateById = asyncHandler(async (req, res) => {
    const { userId } = BookModel.findById(req.params.id)
    if (req.auth?.userId !== userId) {
      res.status(403).json("403: unauthorized request")
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

    await BookModel.updateOne({ _id: req.params.id }, book)

    res.status(204).json({ message: "updated" })
  })

  static deleteById = asyncHandler(async (req, res) => {
    const book = await BookModel.findById(req.params.id)
    if (!book) {
      res.status(404).json({ message: "not found" })
      return
    }

    if (book.userId !== req.auth.userId) {
      res.status(403).json("403: unauthorized request")
      return
    }

    await BookModel.deleteOne({ _id: req.params.id })
    deleteUpload(book.imageUrl)

    res.status(204).json({ message: "deleted" })
  })

  static addRatingById = asyncHandler(async (req, res) => {
    const { userId, rating } = req.body
    if (rating < 0 || rating > 5)
      throw new ValidationError("rating must be between 0 and 5")

    const book = await BookModel.findById(req.params.id)
    if (book.ratings.find((r) => r.userId === userId)) {
      throw new ValidationError("cannot rate a book twice")
    }

    book.ratings.push({
      userId,
      grade: rating,
    })
    book.averageRating = average(book.ratings.map((rating) => rating.grade))

    const BookObject = new BookModel(book)
    await BookObject.save()
    res.status(204).json(book)
  })
}

export default BookController
