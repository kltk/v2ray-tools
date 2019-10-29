#!/usr/bin/env node

const { Base64 } = require('js-base64');
const { default: produce } = require('immer');

function streamSettings(config, data) {
  config.network = data.net;

  if (data.tls === 'tls') {
    config.security = 'tls';
    if (data.host) config.tlsSettings.serverName = data.host;
  }

  if (data.net === 'kcp') {
    const { kcpSettings } = config;
    kcpSettings.header.type = data.type;
  } else if (data.net === 'ws') {
    const { wsSettings } = config;
    if (data.host) wsSettings.headers.Host = data.host;
    if (data.path) wsSettings.path = data.path;
  } else if (data.net === 'h2') {
    const { httpSettings } = config;
    if (data.host) httpSettings.host = data.host.split(',');
    httpSettings.path = data.path;
  } else if (data.net === 'quic') {
    const { quicSettings } = config;
    quicSettings.security = data.host;
    quicSettings.key = data.path;
    quicSettings.header.type = data.type;
  } else if (data.net === 'tcp') {
    if (data.type === 'http') {
      const { tcpSettings } = config;
      tcpSettings.header.request.headers.Host = data.host;
      tcpSettings.header.request.path = [data.path];
    }
  } else {
  }
}

function vmess(config, data) {
  const [vnext] = config.settings.vnext;
  const [user] = vnext.users;
  vnext.address = data.add;
  vnext.port = data.port * 1;
  user.id = data.id;
  user.alterId = data.aid * 1;
  config.protocol = 'vmess';
  config.tag = `${data.ps} ${data.add} ${data.port}`;
}

function outbound(config, data) {
  if (data.protocol === 'vmess') {
    vmess(config, data);
  }
  streamSettings(config.streamSettings, data);
}

function parseVMess(url) {
  if (!url) return;
  if (!url.startsWith('vmess://')) return;
  const vmDec = Base64.decode(url.slice(8));
  if (!vmDec) return;

  return { protocol: 'vmess', ...JSON.parse(vmDec) };
}

function vmess2config({ base, url, port, listen }) {
  const baseConfig = require(base);
  return produce(baseConfig, config => {
    const data = parseVMess(url);

    const [inbound] = config.inbounds;
    if (port) inbound.port = port;
    if (listen) inbound.listen = listen;
    outbound(config.outbounds[0], data);
  });
}

module.exports = vmess2config;
