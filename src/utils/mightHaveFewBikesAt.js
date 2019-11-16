export default (station, time) => {
  const loans =
    station.loans[time.weekDay] &&
    station.loans[time.weekDay][time.hour]
      ? station.loans[time.weekDay][time.hour]
      : 0;

  const returns =
    station.returns[time.weekDay] &&
    station.returns[time.weekDay][time.hour]
      ? station.returns[time.weekDay][time.hour]
      : 0;

  return returns - loans < 0;
};