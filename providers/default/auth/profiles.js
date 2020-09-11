const userIsAuthenticated = (user) => user && user.isActive;
const userHasProfileGranted = (user, profiles) => {
  return user && user.profile && (profiles.includes(user.profile.code) || user.profile.code === 'admin')
};

const isRouteAllowed = (profiles) => (profiles[0] === '*');

const userHasProfile = (user, profiles) => {
  if(!profiles.length) {
    return userIsAuthenticated(user)
  }

  return userIsAuthenticated(user)
  && (isRouteAllowed(profiles) || userHasProfileGranted(user, profiles))
}

module.exports = { userHasProfile };
