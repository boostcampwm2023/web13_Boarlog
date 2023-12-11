import { RelayServer } from './RelayServer';
import * as http from 'http';
import fs from 'fs';

const PORT = 3000;

const relayServer = new RelayServer(PORT);
relayServer.listen('/create-room', 'connection', relayServer.createRoom);
relayServer.listen('/enter-room', 'connection', relayServer.enterRoom);
relayServer.listen('/lecture', 'connection', relayServer.lecture);

export { relayServer };

// const app = http.createServer((req, res) => {
//   try {
//     fs.readFile(__dirname + '/../' + req.url, (err, file) => {
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.end(file);
//     });
//   } catch (e) {
//     console.log(e);
//   }
// });
//
// app.listen(8080);
