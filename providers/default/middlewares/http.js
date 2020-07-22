const UnauthorizedError = require('../../../errors/unauthorized-error');
const { userHasPermission } = require('../auth/permissions');
const { userHasProfile } = require('../auth/profiles');


module.exports = async (req, res, next) => {
  const {
    user, permissions, profiles, publicRoute,
  } = req;

  if (userHasPermission(user, permissions) || userHasProfile(user, profiles) || (publicRoute || user)) {
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
