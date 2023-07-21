import { ValidationError } from "../utils/errors.js"

const notFound = (req, res, next) => {
  const error = new Error(`NotFound - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, _req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404
    message = "Resource not found"
  }

  if (err instanceof ValidationError) {
    statusCode = 422
  }

  console.log(err.name)
  console.error(err)

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

export { notFound, errorHandler }
