#!/usr/bin/env node

const findDefaultConfig = require('./utils/findDefaultConfig');

function vmess2ConfigArgs(yargs) {
  return yargs
    .option('base', {
      default: findDefaultConfig(),
      describe: 'base v2ray config file path',
    })
    .option('url', {
      describe: 'vmess url',
      demandOption: true,
    })
    .option('port', {
      type: 'number',
      default: 10800,
      describe: 'port for listen',
    })
    .option('listen', {
      describe: 'listen interface',
    });
}

function vmess2ConfigHandler(argv) {
  const vmess2config = require('./vmess2config');
  const config = vmess2config(argv);
  console.log(JSON.stringify(config, '', 2));
}

function vmessTestArgs(yargs) {
  return vmess2ConfigArgs(yargs)
    .array('url')
    .describe('port', 'base port for listen')
    .default('test-url', 'https://www.google.com')
    .default('v2ray-path', 'v2ray');
}

function vmessTestHandler({ url, ...argv }) {
  const vmessTest = require('./vmessTest');
  vmessTest({ urls: url, ...argv });
}

require('yargs')
  .command(
    'vmess2config',
    'convert vmess url into v2ray config',
    vmess2ConfigArgs,
    vmess2ConfigHandler,
  )
  .command(
    'vmesstest',
    'test avaliability for server from url',
    vmessTestArgs,
    vmessTestHandler,
  )
  .help().argv;
