import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import supertest from 'supertest'
import { createAndAuthenticateUser } from './create-and-authenticate-user'

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

  it('should be able to create a meal', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: true,
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.meal.id).toBeTypeOf('string')
  })

  it('should be able to get meals list', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: true,
      })

    const response = await supertest(app.server)
      .get('/meals/list')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })

  it('should be able to get meal by id', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const mealCreated = await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: true,
      })

    const response = await supertest(app.server)
      .get(`/meals/${mealCreated.body.meal.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })

  it('should be able to update meal by id', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const mealCreated = await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: true,
      })

    const response = await supertest(app.server)
      .patch(`/meals/${mealCreated.body.meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pastel de carne' })

    expect(response.statusCode).toEqual(200)
  })

  it('should be able to delete meal by id', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const mealCreated = await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: true,
      })

    const response = await supertest(app.server)
      .delete(`/meals/${mealCreated.body.meal.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })
})
