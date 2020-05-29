const userIsAuthenticated = (user) => user && user.isActive;
const userHasPermissionGranted = (user, permissions) => user
  && user.permissions
  && user.permissions
    .some((p) => permissions.some((i) => i.toLowerCase() === p.code.toLowerCase()));

const permissionsWasProvided = (permissions) => permissions && permissions.length > 0;

const isRouteAllowed = (permissions) => (permissions.length === 1 && permissions[0] === '*');

const userHasPermission = (user, permissions) => permissionsWasProvided(permissions)
  && userIsAuthenticated(user)
  && (isRouteAllowed(permissions) || userHasPermissionGranted(user, permissions));

module.exports = { userHasPermission };
