import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { authenticateRouter } from './routes/authenticate/routes'
import { mealsRouter } from './routes/meals/routes'
import { metricsRouter } from './routes/metrics/routes'
import { ZodError } from 'zod'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Api Daily Diet',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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
