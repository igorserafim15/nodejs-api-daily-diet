import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { meals } from './meals'
import { checkJwt } from '../middlewares/check-jwt'

export async function metricsRouter(app: FastifyInstance) {
  app.get('/count', { onRequest: [checkJwt] }, (req, res) => {
    const userId = req.user.sub

    const count = meals.filter((item) => item.userId === userId).length

    return res.status(200).send({ count })
  })

  app.get(':isDiet', { onRequest: [checkJwt] }, (req, res) => {
    const querySchema = z.object({
      isDiet: z.enum(['true', 'false']),
    })

    const query = querySchema.parse(req.query)

    const userId = req.user.sub

    const metrics = meals.filter((metric) => {
      return metric.userId === userId && String(metric.isDiet) === query.isDiet
    })

    return res.status(200).send({ metrics })
  })

  app.get('/best-sequence', { onRequest: [checkJwt] }, (req, res) => {
    const userId = req.user.sub

    const mealsFromUser = meals.filter((meal) => meal.userId === userId)
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
