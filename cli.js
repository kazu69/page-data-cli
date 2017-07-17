#!/usr/bin/env node
'use strict';

const page = require('page-data'),
      meow = require('meow'),
      chalk = require('chalk'),
      objectAssign = require('object-assign'),
      moment = require('moment'),
      logSymbols = require('log-symbols'),
      columnify = require('columnify');

const cli = meow(`
    Usage
      $ page <command> <url> <options>

    Command
      status  - page http GET response
      tls     - tls information (subject, issuer, valid term)
      meta    - meta information ( title, keyword, description )

    tls Options
      --servername -n, Servername

    Examples
      $ page state http:\/\/example.com
      $ page tls https:\/\/example.com
      $ page meta http:\/\/example.com
`, {
  alias: {
    n: 'servername'
  }
});

const command = cli.input[0],
      url = cli.input[1];

if (cli.input.length === 0) {
  console.error(logSymbols.error, chalk.red('Input required'));
  process.exit(1);
}

function stateStout(data) {
  const res = `${data.request} - ${data.response.statusCode}: ${data.response.statusMessage}`;
  const code = parseInt(data.response.statusCode, 10);
  switch (true) {
    case code >= 200 && code <= 299:
      console.info(logSymbols.success, chalk.green(res));
      break;
    case code >= 300 && code <= 399:
      console.info(logSymbols.info, chalk.blue(res));
      break;
    default:
      console.info(logSymbols.error, chalk.red(res));
      break;
  }
  
  process.exit(0);
}

function getCsrBase() {
    return { C: '', ST: '', L: '', O: '', OU: '', CN: '' };
}

function tlsStout(data) {
  const subject = objectAssign(getCsrBase(), data.subject),
        issuer = objectAssign(getCsrBase(), data.issuer),
        valid_from = moment(new Date(data.valid_from)).format('YYYY/MM/DD'),
        valid_to = moment(new Date(data.valid_to)).format('YYYY/MM/DD');

  let value = [];

  [subject, issuer].forEach((v) => {
    const tmp = {
      'Country (C)': v.C,
      'State (ST)': v.ST,
      'Locality (L)': v.L,
      'Organization (O)': v.O,
      'Organizational Unit (OU)': v.OU,
      'Common Name (CN)': v.CN
    };
    value.push(tmp);
  });

  const columns = {
    truncate: true,
    preserveNewLines: false,
    columnSplitter: ' | ',
    columns: [
      'Country (C)',
      'State (ST)',
      'Local (L)',
      'Organization (O)',
      'Organizational Unit (OU)',
      'Common Name (CN)'
    ]
  }
  const table = columnify(value, columns);
  const validDate = `valid term: ${valid_from} ~ ${valid_to}`;
  const san = `Subject Alt Name(SAN): ${data.subjectaltname.join(',')}`;
  const output = `${table}\n${validDate}\n${san}`;

  console.info(output);
  process.exit(0);
}

function metaOut(data) {
  const options = {
    truncate: true,
    preserveNewLines: false,
    columnSplitter: ' | ',
    columns: [ 'meta', 'value' ]
  }

  const columns = columnify(data, options);
  console.info(columns);
  process.exit(0);
}

function sterr(error) {
  console.error(logSymbols.error, chalk.red(error));
  process.exit(1);
}

if(!url) { sterr('url is required'); }

switch(command) {
  case 'status':
    page.status(url)
    .then(data => {
      stateStout(data);
    })
    .catch(error => {
      sterr(error);
    });
    break;

  case 'tls':
    let options = {}
    if (cli.flags['servername']) {
      options['servername'] = cli.flags['servername']
    }
    page.tls(url, options)
    .then(data => {
      tlsStout(data);
    })
    .catch(error => {
      sterr(error);
    });
    break;

  case 'meta':
    page.meta(url)
    .then(data => {
      metaOut(data);
    })
    .catch(error => {
      sterr(error);
    });
    break;

  default:
    const error = 'command not found';
    sterr(error);
    break;
}
