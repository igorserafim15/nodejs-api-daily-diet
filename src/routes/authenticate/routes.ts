import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '@/database'
import { cookiesOptions } from '@/utils'
import { checkJwt } from '@/middlewares/check-jwt'
import { signupRoute } from './signup'

export async function authenticateRouter(app: FastifyInstance) {
  signupRoute(app)

  app.post('/signin', async (req, res) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().length(6),
    })

    const body = bodySchema.parse(req.body)

    const user = await knex('users').where('email', body.email).first()

    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    const passwordMatches = await compare(body.password, user.password)

    if (!passwordMatches) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    const token = await res.jwtSign({}, { sign: { sub: user.id } })

    const refreshToken = await res.jwtSign(
      {},
      { sign: { sub: user.id, expiresIn: '1h' } },
    )

    return res
      .setCookie('refreshToken', refreshToken, cookiesOptions)
      .status(200)
      .send({ token })
  })

  app.get('/me', { onRequest: [checkJwt] }, async (req, res) => {
    const userId = req.user.sub

    const user = await knex('users').where('id', userId).first()

    if (!user) {
      return res.status(400).send({ message: 'User not found.' })
    }

    return res.status(200).send({ user: { ...user, password: undefined } })
  })

  app.put('/refresh-token', async (req, res) => {
    await req.jwtVerify({ onlyCookie: true })

    const token = await res.jwtSign({}, { sign: { sub: req.user.sub } })

    const refreshToken = await res.jwtSign(
      {},
      { sign: { sub: req.user.sub, expiresIn: '2m' } },
    )

    return res
      .setCookie('refreshToken', refreshToken, cookiesOptions)
      .status(200)
      .send({ token })
  })
}
