import jwt from "jsonwebtoken"

/**
 * La fonction auth est un middleware qui vérifie le jeton d'autorisation dans les en-têtes de requête
 * et définit l'ID de l'utilisateur authentifié dans l'objet de requête pour un traitement ultérieur,
 * sinon il renvoie un code d'état 401 avec un message "non autorisé".
 * @param {Request} req
 * @param {Response} res
 * @param next - Le paramètre `next` est une fonction qui est appelée pour passer le contrôle à la
 * prochaine fonction middleware dans le cycle requête-réponse. Il est généralement utilisé pour passer
 * à la fonction middleware suivante ou au gestionnaire de route.
 * @returns Dans le bloc catch, une réponse avec un code d'état de 401 et un objet JSON contenant le
 * message "non autorisé" est renvoyé.
 */
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").at(1)
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
    const userId = decodedToken.userId
    req.auth = {
      userId: userId,
    }
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: "not authorized" })
    return
  }
}

export default auth
