const express = require('express');
const { WebSocketServer } = require('ws');
const server = require('http').createServer();

const app = express();

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(3000, () => {
	console.log('listening on port 3000');
})

/** BEGIN WEBSOCKETS  */
const webSocketServer = require('ws').Server;
const wss = new WebSocketServer({server}); // attach the server to the server we created with express above

wss.on('connection', (ws) => {
	const numClients = wss.clients.size; // number of clients currently connected
	console.log('Clients connected ', numClients);

	wss.broadcast('Current visitors ', numClients);

	// a socket can be opened, closed or errored
	if (ws.readyState === ws.OPEN) {
		ws.send('Welcome to my server!');
	}

	ws.on('close', function close() {
		console.log('A client has disconnected!');
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	})
}