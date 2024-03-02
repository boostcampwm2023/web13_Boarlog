import { RelayServer } from './RelayServer';
import { ClientListener } from './listeners/client.listener';
import { LectureListener } from './listeners/lecture.listener';

const PORT = 3000;

const relayServer = new RelayServer(PORT);
const clientListener = new ClientListener();
const lectureListener = new LectureListener();

relayServer.listen('/create-room', 'connection', clientListener.createRoom);
relayServer.listen('/enter-room', 'connection', clientListener.enterRoom);
relayServer.listen('/lecture', 'connection', lectureListener.enterLecture);

export { relayServer };
