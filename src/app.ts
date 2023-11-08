import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { authenticateRouter } from './routes/authenticate'
import { mealsRouter } from './routes/meals'
import { metricsRouter } from './routes/metrics'
import { ZodError } from 'zod'

export const app = fastify()

app.register(authenticateRouter, { prefix: 'user' })
app.register(mealsRouter, { prefix: 'meals' })
app.register(metricsRouter, { prefix: 'metrics' })

app.register(cookie)

app.register(fastifyJwt, {
  secret: 'secret54321',
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '20m' },
})

app.setErrorHandler((error, _, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  return res.status(500).send({
    message: 'Internal server error.',
  })
})
