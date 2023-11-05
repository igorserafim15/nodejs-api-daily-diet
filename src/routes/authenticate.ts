import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function authenticateRouter(app: FastifyInstance) {
  app.post('/signup', async (req, res) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().length(6),
    })

    const body = bodySchema.parse(req.body)

    console.log(body)

    return res.status(201).send()
  })

  app.post('/signin', async (req, res) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().length(6),
    })

    const body = bodySchema.parse(req.body)

    console.log(body)

    return res.status(200).send({ user: 'User' })
  })
}
