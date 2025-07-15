// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // eslint-disable-next-line no-console
  console.error(err);
  req.log.error({err});

  res.status(err.status || 500).json({error: err.message || 'Server error'});
}