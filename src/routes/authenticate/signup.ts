import { knex } from '@/database'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { randomUUID } from 'node:crypto'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().length(6),
})

const responseSchema = {
  409: z.object({
    message: z.string(),
  }),
}

export async function signupRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/signup',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create account',
        body: bodySchema,
        response: responseSchema,
      },
    },
    async (request, response) => {
      const body = request.body

      const emailAlreadyExists = await knex('users')
        .where('email', body.email)
        .first()

      if (emailAlreadyExists) {
        return response.status(409).send({ message: 'Email already exists' })
      }

      const password = await hash(body.password, 6)

      await knex('users').insert({
        id: randomUUID(),
        email: body.email,
        name: body.name,
        password,
      })

      return response.status(201).send()
    },
  )
}
