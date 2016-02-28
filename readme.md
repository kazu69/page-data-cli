# page-data-cli

[page-data](https://www.npmjs.com/package/page-data) command-line tools.

## install

```sh
npm install --global page-data-cli
```

## Usage

```sh
page --help

  simple page data get client tool cli

  Usage
    $ page <command> <url>

  Command
    status  - page http GET response
    tls     - tls information (subject, issuer, valid term)
    meta    - meta information ( title, keyword, description )

  Examples
    $ page state http://example.com
    $ page tls https://example.com
    $ page meta http://example.com
```

## Related

[page-data](https://www.npmjs.com/package/page-data)

## License

MIT © kazu69
