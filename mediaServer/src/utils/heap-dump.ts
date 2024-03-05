import v8 from 'v8';
import fs from 'fs';
import path from 'path';

const DUMP_DIR = path.join(process.cwd(), 'heapdump');

class HeapDumpUtil {
  constructor() {
    if (!fs.existsSync(DUMP_DIR)) {
      fs.mkdirSync(DUMP_DIR);
    }
  }

  createHeapSnapshot = () => {
    const snapshotStream = v8.getHeapSnapshot();
    const fileName = `${Date.now()}.heapsnapshot`;
    const fileStream = fs.createWriteStream(path.join(DUMP_DIR, fileName));
    snapshotStream.pipe(fileStream);
  };
}

const heapDumpUtil = new HeapDumpUtil();
export { heapDumpUtil };
