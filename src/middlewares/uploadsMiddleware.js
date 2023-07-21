import multer from "multer"
import crypto from "node:crypto"
import sharp from "sharp"

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
}

const storage = multer.memoryStorage()
export const uploads = multer({ storage }).single("image")
export const imageOptimization = async (req, res, next) => {
  // no uploads
  if (!req.file) {
    next()
    return
  }

  try {
    // generate random file name
    const filename = `/uploads/${crypto.randomUUID()}.webp`

    // resize and convert to webp
    const image = sharp(req.file.buffer)
    const { width, height } = await image.metadata()

    if (width > 1600) image.resize({ width: 1600 })
    if (height > 1600) image.resize({ height: 1600 })

    await image.webp({ quality: 80 }).toFile(`./public${filename}`)

    // write filename to req
    req.image = {
      filename,
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "error saving image" })
    return
  }
}
