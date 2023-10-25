const http = require('http');

http.createServer((req, res) => {
	res.write('testing this thing out...');
	res.end();
}).listen(3000);

console.log('Server listening on PORT 3000');
