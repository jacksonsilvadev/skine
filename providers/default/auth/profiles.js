const userIsAuthenticated = (user) => user && user.isActive;
const userHasProfileGranted = (user, profiles) => user
  && user.profile && (profiles.includes(user.profile) || user.profile === 'admin');


const profilesWasProvided = (profiles) => profiles && profiles.length > 0;

const isRouteAllowed = (profiles) => (profiles.length === 1 && profiles[0] === '*');

const userHasProfile = (user, profiles) => profilesWasProvided(profiles)
  && userIsAuthenticated(user)
  && (isRouteAllowed(profiles) || userHasProfileGranted(user, profiles));

module.exports = { userHasProfile };
