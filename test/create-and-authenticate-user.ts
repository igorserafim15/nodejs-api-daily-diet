import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await supertest(app.server).post('/user/signup').send({
    name: 'John',
    email: 'email1@email.com',
    password: '123456',
  })

  const response = await supertest(app.server).post('/user/signin').send({
    email: 'email1@email.com',
    password: '123456',
  })

  const token = response.body.token

  return {
    token,
  }
}
