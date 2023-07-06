import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ').at(1)
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
    const userId = decodedToken.userId
    req.auth = {
      userId: userId,
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'not authorized' })
    return
  }
}

export default auth
