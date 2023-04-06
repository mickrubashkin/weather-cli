#!/usr/bin/env node
import process from 'node:process';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import run from '../src/index.js';

yargs(hideBin(process.argv))
  .usage('Get weather for the <city> (or <lat> <lon>).\n\nUsage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('version', '1.0.0')
  .alias('version', 'v')
  .strict()
  .command('$0', 'get weather', () => {}, (argv) => {
    run(argv);
  })
  .options({
    lat: {
      description: 'Input latitude',
      type: 'int',
    },
    lon: {
      description: 'Input longitude',
      type: 'number',
    },
    city: {
      alias: 'c',
      description: 'Input city',
      type: 'string',
    },
    mode: {
      alias: 'm',
      description: 'Input output format',
      default: 'json',
      choices: ['json', 'xml', 'html'],
    },
    output: {
      alias: 'o',
      description: 'Output file path. If not provided, output to stdout',
      type: 'string',
    },
    force: {
      alias: 'f',
      description: 'Rewrite file if output exists',
      type: 'boolean',
      default: false,
    },
  })
  .example([
    ['$0 --lat=39.45 --lon=45.23', 'Get weather for coordinates'],
    ['$0 -c Moscow', 'Get weather for the city'],
    ['$0 -c Moscow -o ./weather.html -m html -f', 'Get weather for the city in html format, output to the ./weather.html. rewrite if file exists'],
  ])
  // .demandOption(['lat', 'lon', 'city'], 'Please provide latitude and longitude')
  .parse();
