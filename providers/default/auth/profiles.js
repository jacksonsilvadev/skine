const userIsAuthenticated = (user) => user && user.isActive;
const userHasProfileGranted = (user, profiles) => user && user.profile && (profiles.includes(user.profile) || user.profile === 'admin');

const isRouteAllowed = (profiles) => (profiles[0] === '*');

const userHasProfile = (user, profiles) => userIsAuthenticated(user)
  && (isRouteAllowed(profiles) || userHasProfileGranted(user, profiles));

module.exports = { userHasProfile };
