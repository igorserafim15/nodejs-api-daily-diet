import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function mealsRouter(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      hours: z.number(),
      isDiet: z.boolean(),
    })

    const body = bodySchema.parse(req.body)

    console.log(body)

    return res.status(201).send()
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

    console.log(body)

    return res.status(200).send()
  })

  app.delete('/', async (req, res) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
    })

    const body = bodySchema.parse(req.body)

    console.log(body)

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

  app.get('/list:filter', async (req, res) => {
    const paramsSchema = z.object({
      filter: z.string(),
    })

    const params = paramsSchema.parse(req.params)

    console.log(params)

    return res.status(200).send({ meals: [] })
  })
}
