import { CookieSerializeOptions } from '@fastify/cookie'

export const cookiesOptions: CookieSerializeOptions = {
  path: '/',
  secure: true,
  sameSite: true,
  httpOnly: true,
}
