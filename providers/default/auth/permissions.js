const userIsAuthenticated = (user) => user && user.isActive;
const userHasPermissionGranted = (user, permissions) => user
  && user.permissions
  && user.permissions
    .some((p) => permissions.some((i) => i.toLowerCase() === p.code.toLowerCase()));

const isRouteAllowed = (permissions) => (permissions[0] === '*');

const userHasPermission = (user, permissions) => { 
  if(!permissions.length){
    return userIsAuthenticated(user)
  }

  return userIsAuthenticated(user)
  && (isRouteAllowed(permissions) || userHasPermissionGranted(user, permissions))
};

module.exports = { userHasPermission };
