import { expect, beforeAll, afterAll, describe, beforeEach, it } from 'vitest'
import { app } from '../src/app'
import supertest from 'supertest'
import { execSync } from 'node:child_process'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    const response = await supertest(app.server).post('/user/signup').send({
      name: 'John',
      email: 'email1@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('it should be able for the email to be a unique key', async () => {
    await supertest(app.server).post('/user/signup').send({
      name: 'John',
      email: 'email1@email.com',
      password: '123456',
    })

    const response = await supertest(app.server).post('/user/signup').send({
      name: 'David',
      email: 'email1@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(409)
  })

  it('should be able to signin', async () => {
    await supertest(app.server).post('/user/signup').send({
      name: 'John',
      email: 'email1@email.com',
      password: '123456',
    })

    const response = await supertest(app.server).post('/user/signin').send({
      email: 'email1@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.token).toBeTypeOf('string')
  })

  it('should be able to email to exist', async () => {
    const response = await supertest(app.server).post('/user/signin').send({
      email: 'email2@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should be able to the password to match', async () => {
    await supertest(app.server).post('/user/signup').send({
      name: 'John',
      email: 'email1@email.com',
      password: '123456',
    })

    const response = await supertest(app.server).post('/user/signin').send({
      email: 'email1@email.com',
      password: 'abcdfg',
    })

    expect(response.statusCode).toEqual(401)
  })

  it.todo('should be able to get data user')
})
