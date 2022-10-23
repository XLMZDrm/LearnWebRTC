#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debug from 'debug';
const debugApp = new debug('learnwebrtc:server');
import http from 'http';
import { Server } from 'socket.io';
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.Server(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Config socket.io
 */

const arrUserInfo = [];
const io = new Server(server);
io.on('connection', (socket) => {
	socket.on('NGUOI_DUNG_DANG_KY', (user) => {
		const isExist = arrUserInfo.some(
			(userInfo) => userInfo === user.username,
		);
		if (isExist) {
			return socket.emit('DANG_KY_THAT_BAI');
		}
		socket.peerId = user.id;
		arrUserInfo.push(user);
		socket.emit('DANH_SACH_ONLINE', arrUserInfo);
		socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
	});
	socket.on('disconnect', () => {
		const index = arrUserInfo.findIndex(
			(user) => user.id === socket.peerId,
		);
		arrUserInfo.splice(index, 1);
		io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
	});
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind =
		typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
