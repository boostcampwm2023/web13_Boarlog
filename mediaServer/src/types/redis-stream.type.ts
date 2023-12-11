type StreamName = string;
type StreamId = string;
type EntryRaw = [StreamId, string[]];
type StreamReadRaw = [StreamName, EntryRaw[]][];

export { EntryRaw, StreamReadRaw };
