export const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((value, index) => results[index]);
};

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
