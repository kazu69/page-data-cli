import test from 'ava';
import execa from 'execa';
import fs from 'fs';
import readline from 'readline';

test('.status()', async t => {
    let result = await execa.shell('node ../cli.js status http://example.com');
    t.true(result.stdout.includes('GET: http://example.com/ - 200: OK'));

    result = await execa.shell('node ../cli.js status https://example.com');
    t.true(result.stdout.includes('GET: https://example.com/ - 200: OK'));
});

test('.tls()', async t => {
  const readStream = fs.createReadStream(__dirname + '/tls.txt', 'utf8');
  const readLine = readline.createInterface(readStream, {});
  const result = await execa.shell('node ../cli.js tls https://example.com');
  readLine.on('line', (line) => {
    t.true(result.stdout.includes(line));
  });
});

test('.meta()', async t => {
  const readStream = fs.createReadStream(__dirname + '/meta.txt', 'utf8');
  const readLine = readline.createInterface(readStream, {});
  const result = await execa.shell('node ../cli.js meta http://example.com');
  readLine.on('line', (line) => {
    t.true(result.stdout.includes(line));
  });
});
