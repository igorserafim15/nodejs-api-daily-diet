import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function metricsRouter(app: FastifyInstance) {
  app.get('/count', (_, res) => {
    const count = 18

    return res.status(200).send({ count })
  })

  app.get(':isDiet', (req, res) => {
    const paramsSchema = z.object({
      isDiet: z.enum(['true', 'false']),
    })

    const params = paramsSchema.parse(req.params)

    console.log(params)

    return res.status(200).send({ metrics: [] })
  })

  app.get('/best-sequence', (_, res) => {
    return res.status(200).send({ bestSequence: 11 })
  })
}

/**
 * const { eachDayOfInterval, format } = require('date-fns');

// Substitua esta matriz com seus próprios dados (true = leu, false = não leu)
const leituraDosDias = [true, true, true, true, true, true, true, false, false, true, true, true, true, true, false];

let comprimentoSequenciaAtual = 0;
let comprimentoSequenciaMaximo = 0;

for (const leu of leituraDosDias) {
  if (leu) {
    comprimentoSequenciaAtual++;
    if (comprimentoSequenciaAtual > comprimentoSequenciaMaximo) {
      comprimentoSequenciaMaximo = comprimentoSequenciaAtual;
    }
  } else {
    comprimentoSequenciaAtual = 0;
  }
}

console.log('A melhor sequência de dias registrados é:', comprimentoSequenciaMaximo);

 */
