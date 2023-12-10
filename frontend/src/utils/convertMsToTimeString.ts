const MS_OF_SECOND = 1000;
const SECOND_OF_HOUR = 3600;
const MINUTE_OF_HOUR = 60;

export const convertMsToTimeString = (ms: string | number) => {
  let msNumber = typeof ms === "string" ? parseInt(ms) : ms;
  let seconds = Math.floor(msNumber / MS_OF_SECOND);
  let hours = Math.floor(seconds / SECOND_OF_HOUR);
  seconds = seconds % 3600;

  let minutes = Math.floor(seconds / MINUTE_OF_HOUR);
  seconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const convertMsTohhmm = (ms: number) => {
  return `${Math.floor(ms / 60)
    .toString()
    .padStart(2, "0")}:${(ms % 60).toString().padStart(2, "0")}`;
};
