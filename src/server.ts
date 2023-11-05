import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { authenticateRouter } from './routes/authenticate'
import { mealsRouter } from './routes/meals'
import { metricsRouter } from './routes/metrics'

export const app = fastify()

app.register(cookie)

app.register(authenticateRouter, { prefix: 'user' })
app.register(mealsRouter, { prefix: 'meals' })
app.register(metricsRouter, { prefix: 'metrics' })

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
