// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'
import { Meal, User } from '.'

declare module 'knex/types/tables' {
  export interface Tables {
    users: User
    meals: Meal
  }
}
