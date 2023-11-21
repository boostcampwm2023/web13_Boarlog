import { RelayServer } from './RelayServer';

const PORT = 3000;

const relayServer = new RelayServer(PORT);
relayServer.listen('/create-room', 'connection', relayServer.createRoom);
// relayServer.listen('/enter-room', 'connection', relayServer.enterRoom);
