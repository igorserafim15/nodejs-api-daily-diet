import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { createAndAuthenticateUser } from './create-and-authenticate-user'

describe('Metrics routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to get count of meals', async () => {
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
      .get('/metrics/count')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.count).toEqual(1)
  })

  it('should be able to get if you are on the diet', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Salada',
        description: 'Restaurante',
        hours: 0,
        isDiet: true,
      })

    await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: false,
      })

    const response = await supertest(app.server)
      .get('/metrics?isDiet=true')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.metrics).toHaveLength(1)
  })

  it('should be able to get if not on the diet', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Salada',
        description: 'Restaurante',
        hours: 0,
        isDiet: true,
      })

    await supertest(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pastel',
        description: 'De feira no domingo',
        hours: 0,
        isDiet: false,
      })

    const response = await supertest(app.server)
      .get('/metrics?isDiet=false')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.metrics).toHaveLength(1)
  })

  it('should be able to get best sequence', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const sequenceMeals = [true, true, true, false, true, false]

    for (const isDiet of sequenceMeals) {
      await supertest(app.server)
        .post('/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Refeição',
          description: 'Descrição da refeição',
          hours: 0,
          isDiet,
        })
    }

    const response = await supertest(app.server)
      .get('/metrics/best-sequence')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.bestSequence).toEqual(3)
  })
})
