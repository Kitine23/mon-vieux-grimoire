import { faker } from '@faker-js/faker'
import express from 'express'
import cors from 'cors'

const PRODUCTS = Array.from({ length: 100 }).map(() => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    price: faker.number.int({ min: 1, max: 100 }),
    inStock: faker.datatype.boolean(),
  }
})

const app = express()
// middleware
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/api/products', (req, res) => {
  res.json({ products: PRODUCTS })
})

app.post('/api/products', (req, res) => {
  PRODUCTS.push({
    _id: faker.database.mongodbObjectId(),
    ...req.body,
  })
  res.json({ product: PRODUCTS.at(-1) })
})

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p._id === req.params.id)
  if (!product) return res.status(404).json({ message: 'Not found!' })
  res.json({ product })
})

app.put('/api/products/:id', (req, res) => {
  const productIndex = PRODUCTS.findIndex((p) => p._id === req.params.id)
  PRODUCTS[productIndex] = {
    ...PRODUCTS[productIndex],
    ...req.body,
  }
  res.json({ message: 'Modified!' })
})

app.delete('/api/products/:id', (req, res) => {
  const productIndex = PRODUCTS.findIndex((p) => p._id === req.params.id)
  PRODUCTS.splice(productIndex, 1)
  res.json({ message: 'Deleted!' })
})

app.listen(3000, () => {
  console.log(`express quizz port 3000`)
})
