const MS_OF_SECOND = 1000;
const SECOND_OF_HOUR = 3600;
const MINUTE_OF_HOUR = 60;

const convertMsToTimeString = (ms: string) => {
  let msNumber = parseInt(ms);
  let seconds = Math.floor(msNumber / MS_OF_SECOND);
  let hours = Math.floor(seconds / SECOND_OF_HOUR);
  seconds = seconds % 3600;

  let minutes = Math.floor(seconds / MINUTE_OF_HOUR);
  seconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
export default convertMsToTimeString;
