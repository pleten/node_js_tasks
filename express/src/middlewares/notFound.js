// eslint-disable-next-line no-unused-vars
export function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Route not found' });
}