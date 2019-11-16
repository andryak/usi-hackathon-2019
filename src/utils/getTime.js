const weekDays = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

export default date => ({
  weekDay: weekDays[date.getDay()],
  hour: date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
});