const routesToSkip = [
  {
    method: 'GET',
    path: '/health-check',
  },
];

const isSameMethod = (route, req) => route.method === req.method;
const isSameUrl = (route, req) => route.path === req.url;
const urlMatchesPath = (route, req) => route.path.endsWith('*') && req.url.startsWith(route.path);
const urlMatchesRoute = (route, req) => isSameUrl(route, req) || urlMatchesPath(route, req);

const routesMatchesRequest = (route, req) => isSameMethod(route, req) && urlMatchesRoute(route, req);

const isSkippedRoute = (req) => routesToSkip.find((r) => routesMatchesRequest(r, req));

const isOpenRoute = (req) => isSkippedRoute(req);

const isClosedRoute = (req) => !isOpenRoute(req);

module.exports = { isOpenRoute, isClosedRoute };
