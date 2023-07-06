import express from 'express'
import uploads from '../middlewares/uploads.js'
import BookController from '../controllers/Book.js'
import auth from '../routes/auth.js'

const bookRouter = express.Router()
bookRouter.get('/', BookController.getAll)
bookRouter.get('/bestrating', BookController.getBestRated)
bookRouter.get('/:id', BookController.getById)
bookRouter.post('/', uploads, auth, BookController.createOne)
bookRouter.put('/:id', auth, BookController.updateById)
bookRouter.delete('/:id', auth, BookController.deleteById)
bookRouter.post('/:id/rating', auth, BookController.addRatingById)

export default bookRouter
