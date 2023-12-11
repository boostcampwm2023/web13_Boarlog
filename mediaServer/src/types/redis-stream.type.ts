type StreamName = string;
type StreamId = string;
type EntryRaw = [StreamId, string[]];
export type StreamReadRaw = [StreamName, EntryRaw[]][];
