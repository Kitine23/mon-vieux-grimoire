import { BookModel } from "../models/BookModel.js"
import { average } from "../utils/arrays.js"
import { NotFoundError, ValidationError } from "../utils/errors.js"
import { deleteUpload } from "../utils/files.js"
import { getHost } from "../utils/urls.js"
import asyncHandler from "express-async-handler"

/* La classe BookController contient des méthodes statiques pour gérer les opérations CRUD sur les
livres, y compris la récupération de tous les livres, la récupération des livres les mieux notés, la
création d'un nouveau livre, la mise à jour d'un livre, la suppression d'un livre et l'ajout d'une
note à un livre. */
class BookController {
  /* méthode statique appelée "getAll" permet de récupérer tout les livres et d'ajouter à l'aide d'une boucle map le nom de domaine devant l'URL des images */
  static getAll = asyncHandler(async (req, res) => {
    const books = await BookModel.find().lean().exec()
    res.json(
      books.map((book) => ({
        ...book,
        imageUrl: getHost(req) + book.imageUrl,
      }))
    )
  })

  /* La méthode `getBestRated` récupère les trois livres avec la note moyenne la plus
  élevée de la base de données et les renvoie sous forme de réponse JSON. */
  static getBestRated = asyncHandler(async (req, res) => {
    const threeBestAverageNoteBooks = await BookModel.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .lean()
      .exec()

    res.json(
      threeBestAverageNoteBooks.map((book) => ({
        ...book,
        imageUrl: getHost(req) + book.imageUrl,
      }))
    )
  })

  /* La méthode `getById` est chargé de récupérer un livre de la base de données en fonction de son ID et de le renvoyer sous forme de
  réponse JSON. */
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

  /* La méthode `createOne` est  responsable
  de la création d'un nouveau livre dans la base de données. */
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

  /* La méthode `updateById` est chargée de
  mettre à jour un livre dans la base de données en fonction de son ID. */
  static updateById = asyncHandler(async (req, res) => {
    const { userId } = await BookModel.findById(req.params.id).lean().exec()
    if (!userId)
      throw new NotFoundError(`Book n°${req.params.id} does not exist`)

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

    res.json({ message: "updated" })
  })

  /* La méthode `deleteById` est chargée de
  supprimer un livre de la base de données. */
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

    res.json({ message: "deleted" })
  })

  /*
   * La méthode `addRatingById` est chargée d'ajouter une note à un livre.
   */
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
    const ratingGrades = book.ratings.map((rating) => rating.grade)
    book.averageRating = average(ratingGrades)

    const BookObject = new BookModel(book)
    await BookObject.save()

    book.imageUrl = getHost(req) + book.imageUrl
    res.json(book)
  })
}

export default BookController
