export default func => {
  const cache = {};
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = await func(...args);
    cache[key] = result;
    return result;
  }
};
