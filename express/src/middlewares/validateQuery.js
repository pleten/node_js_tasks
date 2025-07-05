export const validateQuery = schema => (req, res, next) => {
  console.log('~~~~~~~~~~~~~~~~~~~REQ~~~~~~~~~~~~~~~~~~~~\n', JSON.stringify(req, [''], 4));
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res
      .status(400)
      .json({ errors: result.error.format(), where: 'query' });
  }

  next();
};