import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkJwt } from '@/middlewares/check-jwt'
import { knex } from '@/database'

export async function mealsRouter(app: FastifyInstance) {
  app.post('/', { onRequest: [checkJwt] }, async (req, res) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      hours: z.number(),
      isDiet: z.boolean(),
    })

    const body = bodySchema.parse(req.body)

    const [meal] = await knex('meals')
      .insert({
        id: randomUUID(),
        userId: req.user.sub,
        name: body.name,
        description: body.description,
        hours: body.hours,
        isDiet: body.isDiet,
      })
      .returning('id')

    return res.status(201).send({ meal })
  })

  app.get('/list', { onRequest: [checkJwt] }, async (req, res) => {
    const userId = req.user.sub

    const mealsFromUser = await knex('meals')
      .select('*')
      .where('userId', userId)

    return res.status(200).send({ meals: mealsFromUser })
  })

  app.patch('/:id', { onRequest: [checkJwt] }, async (req, res) => {
    const bodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      hours: z.number().optional(),
      isDiet: z.boolean().optional(),
    })

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = paramsSchema.parse(req.params)
    const userId = req.user.sub

    const meal = await knex('meals')
      .where('id', params.id)
      .andWhere('userId', userId)
      .first()

    if (!meal) {
      return res.status(422).send({ message: 'Meal not found' })
    }

    const body = bodySchema.parse(req.body)

    await knex('meals').update({ ...body })

    return res.status(200).send()
  })

  app.delete('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = paramsSchema.parse(req.params)

    await knex('meals').del().where('id', params.id)

    return res.status(200).send()
  })

  app.get('/:id', { onRequest: [checkJwt] }, async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = paramsSchema.parse(req.params)

    const userId = req.user.sub

    const meal = await knex('meals')
      .where('id', params.id)
      .andWhere('userId', userId)
      .first()

    if (!meal) {
      return res.status(422).send({ message: 'Meal not found.' })
    }

    return res.status(200).send({ meal })
  })
}
