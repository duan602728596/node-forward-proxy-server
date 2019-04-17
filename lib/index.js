const http = require('http');
const createHttpProxy = require('./createHttpProxy');
const createHttpsProxy = require('./createHttpsProxy');

const server = new http.Server();
const port = 5060;

// 代理接收客户端的转发请求
createHttpProxy(server);
createHttpsProxy(server);

server.on('error', (err) => console.error(err));

server.listen(port, () => console.log(`Start at ${ 5060 }.\n`));