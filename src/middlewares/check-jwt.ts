import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkJwt(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    return res.status(401).send({ message: 'Unauthorized.' })
  }
}
