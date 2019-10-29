V2Ray Tools
====

Installaction
----
```
npm -g install v2ray-tools
```

Usage
----
```
v2ray-tools [command]

Commands:
  v2ray-tools vmess2config  convert vmess url into v2ray config
  v2ray-tools vmesstest     test avaliability for server from url

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
```
v2ray-tools vmess2config

convert vmess url into v2ray config

Options:
  --base     base v2ray config file path              [default: "src/base.json"]
  --url      vmess url                                                [required]
  --port     port for listen                           [number] [default: 10800]
  --listen   listen interface
```
```
v2ray-tools vmesstest

test avaliability for server from url

Options:
  --base        base v2ray config file path           [default: "src/base.json"]
  --url         vmess url                                     [array] [required]
  --port        base port for listen                   [number] [default: 10800]
  --listen      listen interface
  --test-url                                 [default: "https://www.google.com"]
  --v2ray-path                                                [default: "v2ray"]
```

Todo
----
* [x] parser vmess url
* [x] convert vmess url into v2ray config
* [x] avaliability test for server from vmess url
* [ ] maxium speed test for server
* [ ] read urls from file for test
* [ ] Electron GUI