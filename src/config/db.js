/**
 * La fonction `connectDB` se connecte à une base de données MongoDB à l'aide de l'URI MongoDB fourni
 * et enregistre un message de réussite si la connexion est réussie, ou un message d'erreur s'il y a
 * une erreur.
 */
import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message} `)
    process.exit(1)
  }
}

export default connectDB
