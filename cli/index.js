import commander from 'commander'
import { Cli } from './cli.class'
import { PARTNER_TYPES, MERCHANT_TYPES } from './faker';

const program = new commander.Command()
program.version('0.0.1')
program
  .description('Zodaka CLI helper')

  .option('-o, --output', 'show output', false)

  .option('-c, --consumer <number>', 'Create consumers', 0)

  .option('-p, --partner <number>', 'Create partners', 0)
  .option('--partner-type <string>', 'Combined with the parameter -p. The partner type for the partners that will be created. Could be: ' + PARTNER_TYPES.join(','))

  .option('--payment <number>', 'Create payments', 0)
  .option('--payment-status <number<0-4>>', 'Set the status of the payments that was created before. If the number is out of the valid ranges, the payme', 0)

  .option('-m, --merchant <number>', 'Create merchants', 0)
  .option('--merchant-type <string>', 'Combined with the parameter -m. The merchant type for the merchants that will be created. Could be: ' + Object.keys(MERCHANT_TYPES).join(','))


  .option('-a, --all <number>', 'create consumers, partners and merchants in the same amount', false)
  .option('--async', 'If true, it will try to make all the possible request async. Can be inestable', false)
  .option('-s, --session <token>', 'JWT token session. If this is undefined, then we use the admin test credentials to login in the API')

  .parse(process.argv)

const options = program.opts()
const cli = new Cli('localhost', process.env.PORT, options.async, options.session)

Promise.all([
  cli.create(options)
]).then(() => {
  process.exit(0)
}).catch(e => {
  console.log(e)
  process.exit(1)
})