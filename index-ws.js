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
});

process.on('SIGINT', () => {
	wss.clients.forEach(function each(client) {
		client.close();
	});
	server.close(() => {
		shutdownDB();
	});
});

/** BEGIN WEBSOCKETS  */
const webSocketServer = require('ws').Server;
const wss = new WebSocketServer({server}); // attach the server to the server we created with express above

wss.on('connection', (ws) => {
	const numClients = wss.clients.size; // number of clients currently connected
	console.log('Clients connected ', numClients);

	wss.broadcast(`Current visitors ${numClients}`);

	// a socket can be opened, closed or errored
	if (ws.readyState === ws.OPEN) {
		ws.send('Welcome to my server!');
	}

	db.run(`INSERT INTO visitors (count, time) VALUES(${numClients}, datetime('now'))`);

	ws.on('close', function close() {
		console.log('A client has disconnected!');
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	})
}

/** END WEBSOCKETS  */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
	db.run(`CREATE TABLE visitors (
		count INTEGER,
		time TEXT
	)`);
});

function getCounts() {
	db.each('SELECT * FROM visitors', (err, row) => {
		console.log(row);
	});
}

function shutdownDB() {
	getCounts();
	console.log('shutting down...');
	db.close();
}