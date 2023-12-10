const MS_OF_SECOND = 1000;
const MS_OF_MINUTE = 60 * MS_OF_SECOND;
const MS_OF_HOUR = 60 * MS_OF_MINUTE;

const convertTimeStringToMS = (timeString: string) => {
  const [hour, minute, second] = timeString.split(":");
  const result = parseInt(hour) * MS_OF_HOUR + parseInt(minute) * MS_OF_MINUTE + parseInt(second) * MS_OF_SECOND;

  return result;
};

export default convertTimeStringToMS;
