export default distance => (
  distance < 1000
    ? `${Math.round(distance)} m`
    : `${Math.round(distance / 100) / 10} km`
);
