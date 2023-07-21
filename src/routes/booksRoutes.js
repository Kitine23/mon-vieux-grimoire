import express from "express"
import BookController from "../controllers/BookController.js"
import auth from "../middlewares/authMiddleware.js"
import { uploads, imageOptimization } from "../middlewares/uploadsMiddleware.js"

const bookRouter = express.Router()
bookRouter.get("/", BookController.getAll)
bookRouter.get("/bestrating", BookController.getBestRated)
bookRouter.get("/:id", BookController.getById)
bookRouter.post("/", auth, uploads, imageOptimization, BookController.createOne)
bookRouter.put(
  "/:id",
  auth,
  uploads,
  imageOptimization,
  BookController.updateById
)
bookRouter.delete("/:id", auth, BookController.deleteById)
bookRouter.post("/:id/rating", auth, BookController.addRatingById)

export default bookRouter
