import express from 'express'
import uploads from '../middlewares/uploads.js'
import BookController from '../controllers/Book.js'

const bookRouter = express.Router()
bookRouter.get('/', BookController.getAll)
bookRouter.get('/bestrating', BookController.getBestRated)
bookRouter.get('/:id', BookController.getById)
bookRouter.post('/', uploads, BookController.createOne)
bookRouter.put('/:id', BookController.updateById)
bookRouter.delete('/:id', BookController.deleteById)
bookRouter.post('/:id/rating', BookController.addRatingById)

export default bookRouter
