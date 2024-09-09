import { knex } from '@/database'
import { checkJwt } from '@/middlewares/check-jwt'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function metricsRouter(app: FastifyInstance) {
  app.get('/count', { onRequest: [checkJwt] }, async (req, res) => {
    const userId = req.user.sub

    const count = await knex('meals')
      .where('userId', userId)
      .count('id as count')
      .first()

    return res.status(200).send(count)
  })

  app.get(':isDiet', { onRequest: [checkJwt] }, async (req, res) => {
    const querySchema = z.object({
      isDiet: z.enum(['true', 'false']),
    })

    const query = querySchema.parse(req.query)

    const userId = req.user.sub

    const metrics = await knex('meals')
      .where('userId', userId)
      .andWhere('isDiet', JSON.parse(query.isDiet))

    return res.status(200).send({ metrics })
  })

  app.get('/best-sequence', { onRequest: [checkJwt] }, async (req, res) => {
    const userId = req.user.sub

    const mealsFromUser = await knex('meals').where('userId', userId)
    const sequenceMeals = mealsFromUser.map((meal) => meal.isDiet)

    let currentSequence = 0
    let bestSequence = 0

    for (const isDiet of sequenceMeals) {
      if (isDiet) {
        currentSequence++

        if (currentSequence > bestSequence) {
          bestSequence = currentSequence
        }
      } else {
        currentSequence = 0
      }
    }

    return res.status(200).send({ bestSequence })
  })
}
