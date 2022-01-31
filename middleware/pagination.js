export const pagination = (req, res, next) => {
  const limit = req.query.limit ? +req.query.limit : 5;
  const page = req.query.page ? +req.query.page : 1;
  req.pagination = { limit, page };
  next();
};
