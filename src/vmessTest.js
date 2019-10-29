const child_process = require('child_process');
const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');
const vmess2config = require('./vmess2config');

function runV2RayWithConfig(v2RayPath, config) {
  const args = ['-config', 'stdin:'];
  const v2ray = child_process.spawn(v2RayPath, args);

  // v2ray.stdout.on('data', data => console.log('stdout', data.toString()));
  // v2ray.stderr.on('data', data => console.log('stderr', data.toString()));

  v2ray.stdin.write(JSON.stringify(config));
  v2ray.stdin.end();

  return v2ray;
}

function test({ url, base, port, listen, testUrl, v2RayPath }) {
  const config = vmess2config({ base, url, listen, port });
  const v2ray = runV2RayWithConfig(v2RayPath, config);

  const { tag } = config.outbounds[0];

  const httpsAgent = new SocksProxyAgent(`socks5://localhost:${port}`);
  axios
    .get(testUrl, {httpsAgent})
    .then(res => res.data)
    .then(() => console.log(`ok ${tag}`))
    .catch(() => console.log(`err ${tag}`))
    .then(() => v2ray.kill());
}

function vmessTest({ urls, base, port, ...rest }) {
  urls.forEach(function(url, index) {
    test({ url, base, port: index + port, ...rest });
  });
}

module.exports = vmessTest;
