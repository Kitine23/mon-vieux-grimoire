import { app } from "./src/app.js"

app.listen(process.env.PORT, () => {
  console.log(
    `mon vieux Grimoire express serveur listening on port ${process.env.PORT}`
  )
})
