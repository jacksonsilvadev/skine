const UnauthorizedError = require('../../../errors/unauthorized-error');
const { userHasPermission } = require('../auth/permissions');

module.exports = async (req, res, next) => {
  const { user, permissions, publicRoute } = req;
  if (userHasPermission(user, permissions) || publicRoute) {
    next();
  } else {
    const username = user && user.name ? user.name : 'Anonymous';
    next(
      new UnauthorizedError(
        `User ${username} is not authorized to use this operation.`,
      ),
    );
  }
};
