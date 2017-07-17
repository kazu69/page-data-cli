import test from 'ava';
import execa from 'execa';
import fs from 'fs';
import readline from 'readline';

test('.status()', async t => {
    let result = await execa.shell('node cli.js status http://example.com');
    t.true(result.stdout.includes('GET: http://example.com/ - 200: OK'));

    result = await execa.shell('node cli.js status https://example.com');
    t.true(result.stdout.includes('GET: https://example.com/ - 200: OK'));
});

test.cb('.tls()', t => {
  const readStream = fs.createReadStream(__dirname + '/tls.txt', 'utf8');
  const sans = [
    'www.example.org',
    'example.com',
    'example.edu',
    'example.net',
    'example.org',
    'www.example.com',
    'www.example.edu',
    'www.example.net'
    ];
    const sansResult = `Subject Alt Name(SAN): ${sans.join(', ')}`

  let lines = [],
      result;

  const readFIle = new Promise((resolve, reject) => {
    readline.createInterface(readStream, {}).on('line', line => {
      lines.push(line)
    });
    resolve(lines);
  });

  const readStdOut = new Promise((resolve, reject) => {
    execa.shell('node cli.js tls https://example.com -n=example.com').then(res => {
      result = res
      resolve(res);
    })
  });

  Promise.all([readFIle, readStdOut]).then(() => {
    lines.map(line => {
      t.true(result.stdout.includes(line));
    });
    t.true(result.stdout.includes(sansResult));
    t.end();
  });
});

test.cb('.meta()', t => {
  const readStream = fs.createReadStream(__dirname + '/meta.txt', 'utf8');
  let lines = [],
      result;

  const readFIle = new Promise((resolve, reject) => {
    readline.createInterface(readStream, {}).on('line', line => {
      lines.push(line);
    });
    resolve(lines);
  });

  const readStdOut = new Promise((resolve, reject) => {
    execa.shell('node cli.js meta http://example.com').then(res => {
      result = res;
      resolve(res);
    });
  });

  Promise.all([readFIle, readStdOut]).then( () => {
    lines.map(line => {
      t.true(result.stdout.includes(line));
    });
    t.end();
  });

});
