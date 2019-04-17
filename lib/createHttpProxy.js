const url = require('url');
const http = require('http');

/* http代理 */
function createHttpProxy(server) {
  server.on('request', (req, res) => {
    // 解析客户端请求
    const urlInformation = url.parse(req.url);
    const { host } = req.headers;
    const options = {
      protocol: 'http:',
      hostname: host.split(':')[0],
      method: req.method,
      port: host.split(':')[1] || 80,
      path: urlInformation.path,
      headers: req.headers
    };

    // 根据客户端请求，向真正的目标服务器发起请求。
    const proxyReq = http.request(options, (proxyRes) => {
      // 设置客户端响应的http头部
      Object.keys(proxyRes.headers).forEach(function(key) {
        res.setHeader(key, proxyRes.headers[key]);
      });

      // 设置客户端响应状态码
      res.writeHead(proxyRes.statusCode);

      // 通过pipe的方式把真正的服务器响应内容转发给客户端
      proxyRes.pipe(res);
    });

    // 通过pipe的方式把客户端请求内容转发给目标服务器
    req.pipe(proxyReq);

    res.on('error', (err) => console.error(err));
    proxyReq.on('error', (err) => console.error(err));
  });
}

module.exports = createHttpProxy;