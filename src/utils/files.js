import fs from "node:fs"

export const deleteUpload = (filename) => {
  fs.unlink(`./public${filename}`, (err) => {
    if (err) throw err
    console.log(`./public${filename} has been deleted`)
  })
}
