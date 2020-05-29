const conditionalMiddleware = (shouldApply, middleware) => async (req, res, next) => {
  try {
    if (shouldApply(req)) {
      await middleware(req, res, next);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { conditionalMiddleware };
