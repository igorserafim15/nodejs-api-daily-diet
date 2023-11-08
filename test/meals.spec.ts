import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import supertest from 'supertest'

describe('Meals routes', () => {
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

  it.only('should be able to create a meal', async () => {
    const response = await supertest(app.server).post('/meals').send({
      name: 'Alface 3',
      description: 'De feira no domingo',
      hours: 0,
      isDiet: true,
    })

    expect(response.statusCode).toEqual(201)
  })
})
