import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkJwt } from '../middlewares/check-jwt'

interface Meal {
  id: string
  name: string
  description: string
  hours: number
  isDiet: boolean
}

export let meals: Meal[] = []

export async function mealsRouter(app: FastifyInstance) {
  app.post('/', { onRequest: [checkJwt] }, async (req, res) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      hours: z.number(),
      isDiet: z.boolean(),
    })

    const body = bodySchema.parse(req.body)

    meals.push({
      id: randomUUID(),
      name: body.name,
      description: body.description,
      hours: body.hours,
      isDiet: body.isDiet,
    })

    return res.status(201).send()
  })

  app.get('/list', { onRequest: [checkJwt] }, async (_, res) => {
    return res.status(200).send({ meals })
  })

  app.patch('/', async (req, res) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      description: z.string().optional(),
      hours: z.number().optional(),
      isDiet: z.boolean().optional(),
    })

    const body = bodySchema.parse(req.body)

    const meal = meals.find((meal) => meal.id === body.id)

    if (!meal) {
      return res.status(409).send({ message: 'Meal not found' })
    }

    const mealUpdated = { ...meal, ...body }

    const updatedListMeals = meals.filter((meal) => meal.id !== body.id)
    meals = [...updatedListMeals, mealUpdated]

    return res.status(200).send()
  })

  app.delete('/', async (req, res) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
    })

    const body = bodySchema.parse(req.body)

    const listUpdated = meals.filter((item) => item.id !== body.id)
    meals = listUpdated

    return res.status(200).send()
  })

  app.get('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = paramsSchema.parse(req.params)

    console.log(params)

    return res.status(200).send({ meal: {} })
  })
}
