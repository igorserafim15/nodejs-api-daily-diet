import { expect, test, beforeAll } from 'vitest'
import { app } from '../src/app'
import supertest from 'supertest'

beforeAll(async () => {
  await app.ready()
})

test('should be able to', async () => {
  supertest(app.server)
})
