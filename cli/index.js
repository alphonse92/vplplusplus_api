//  docker exec -it api  npx babel-node cli

import commander from 'commander'
import { Cli } from './cli.class'

const program = new commander.Command()
program.version('1.0.0')
program
  .description('Virtual Programming Lab Plus Plus')

  .option('-o, --output', 'show output', false)
  .option('-p, --project <number>', 'Create project', 0)
  .option('--teacher <teacher mongo id>', 'Teacher owner')
  .option('--activity <number>', 'Activity moodle id')
  .option('--from <string>', 'Project creation date')
  .option('--to <number>', 'The date of the last submission')
  .parse(process.argv)

const options = program.opts()
const cli = new Cli('localhost', process.env.PORT)

Promise.all([
  cli.create(options)
]).then(() => {
  process.exit(0)
}).catch(e => {
  console.log(e)
  process.exit(1)
})