import { NotFoundError, ValidationError } from "../utils/errors.js"

/**
 * La fonction `notFound` est un middleware qui gère les demandes de routes introuvables, renvoyant un
 * code d'état 404 et transmettant une erreur au middleware suivant.
 * @param req -  objet qui représente la requête HTTP faite par le client. Il
 * contient des informations telles que dans ce cas, `req.originalUrl` est l'URL d'origine demandée par le client.
 * @param res -objet de réponse dans Express.js utilisé pour renvoyer
 * la réponse au client. Dans ce cas, il est utilisé pour définir le code d'état de la réponse sur 404
 * (Non trouvé) et transmettre l'objet d'erreur à la fonction middleware suivante.
 * @param next - fonction utilisée pour passer le contrôle à la prochaine fonction middleware dans le cycle requête-réponse. Il est généralement utilisé pour invoquer la fonction middleware suivante dans la chaîne. Dans ce cas, il est utilisé pour
 * transmettre l'erreur à la prochaine fonction middleware après avoir défini l'état de la réponse
 */
const notFound = (req, res, next) => {
  const error = new Error(`NotFound - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

/**
 * La fonction errorHandler gère les erreurs dans une application Node.js en définissant le code d'état
 * approprié et en renvoyant une réponse JSON avec un message d'erreur et une trace de pile (si en mode
 * développement).
 * @param err - Le paramètre `err` est l'objet d'erreur qui est passé à la fonction de gestionnaire
 * d'erreurs. Il contient des informations sur l'erreur qui s'est produite, telles que le message
 * d'erreur, le nom de l'erreur et la trace de la pile d'erreurs.
 */
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

  if (err instanceof NotFoundError) {
    statusCode = 404
  }

  console.log(err.name)
  console.error(err)

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

export { notFound, errorHandler }
