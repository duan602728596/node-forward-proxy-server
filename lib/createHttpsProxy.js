const url = require('url');
const net = require('net');

/* https代理 */
function createHttpsProxy(server) {
  server.on('connect', (req, cltSocket, head) => {
    const urlInfo = url.parse(`http://${ req.url }`);

    const netSocket = net.connect(urlInfo.port, urlInfo.hostname, () => {
      cltSocket.write('HTTP/1.1 200 Connection Established\r\nProxy-agent: MITM-proxy\r\n\r\n');

      netSocket.write(head);
      netSocket.pipe(cltSocket);

      cltSocket.pipe(netSocket);
      cltSocket.on('error', (err) => console.error(err));
    });

    netSocket.on('error', (err) => console.error(err));
  });
}

module.exports = createHttpsProxy;