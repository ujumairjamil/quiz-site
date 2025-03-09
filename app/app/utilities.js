/** Get the submitted POST data from a request as an object. */
const getData = async (request) => {
  const body = request.body();
  const params = await body.value;
  return Object.fromEntries(params);
};

export { getData };