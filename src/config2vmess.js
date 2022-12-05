const path = require('path')
const { Base64 } = require('js-base64');


const VMESS_PROTO = 'vmess://';

function streamSettingsReverse(config) {
  let net = null, tls = null, host = null, type = null, path = null;

  net = config.network;

  if (config.security === 'tls') {
    tls = 'tls';
    if (config.tlsSettings.serverName) host = config.tlsSettings.serverName;
  }

  if (net === 'kcp') {
    const { kcpSettings } = config;
    type = kcpSettings.header.type 
  } else if (net === 'ws') {
    const { wsSettings } = config;
    if (host) host = wsSettings.headers.Host;
    if (wsSettings.path) path = wsSettings.path;
  } else if (net === 'h2') {
    const { httpSettings } = config;
    if (httpSettings.host) host = httpSettings.host.join(',');
    path = httpSettings.path;
  } else if (net === 'quic') {
    const { quicSettings } = config;
    host = quicSettings.security 
    path = quicSettings.key
    type = quicSettings.header.type;
  } else if (net === 'tcp') {
    const { tcpSettings } = config;
    if (tcpSettings && tcpSettings.header && tcpSettings.header.type === 'http') {
      type = tcpSettings.header.type;
      host = tcpSettings.header.request.headers.Host 
      path = tcpSettings.header.request.path[0]
    }
  }

  return {
    net, tls, host, type, path
  }
}


function createVmessObj(outboundConfig) {
  const [ps, add, port] = outboundConfig.tag.split(' ');
  const streamSettings = outboundConfig.streamSettings;
  const [vnext] = outboundConfig.settings.vnext;
  const [user] = vnext.users;
  const id = user.id;
  const aid = user.alterId;
  const { net, tls, host, type, path } = streamSettingsReverse(streamSettings);

  const obj = {
    v: "2",
    ps: ps || "none",
    add: add || "none",
    port: Number(port) || 0,
    id: id || 0,
    aid: aid || 0,
    net: net || "none",
    type: type || "none",
    host: host || "",
    path: path || "none",
    tls: tls || "none",
  }

  return obj;
}

function createEncodedUrl(config) {
  const [outbound] = config.outbounds;
  if (outbound.protocol === 'vmess') {
    const vmessObj = createVmessObj(outbound);
    const jsoned = JSON.stringify(vmessObj, null, 2);
    const encodedString = Base64.encode(jsoned)
    return `${VMESS_PROTO}${encodedString}`;
  } else return new Error("only vmess protocol URLs are supported");
}


module.exports = function config2vmess({ path: filePath }) {
  try {
    const absolute = path.resolve(process.cwd(), filePath);
    const config = require(absolute);
    const encoded = createEncodedUrl(config);
    return encoded;
  } catch (e) {
    console.log(e)
    return false;
  }
}
