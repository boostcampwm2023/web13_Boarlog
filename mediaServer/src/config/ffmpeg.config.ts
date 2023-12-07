// const videoConfig = (size: string) => ['-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', size, '-r', '30'];
const audioConfig = ['-f s16le', '-ar 48k', '-ac 1'];

export { audioConfig };
