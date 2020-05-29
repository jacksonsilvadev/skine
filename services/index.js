/* eslint-disable no-param-reassign */
const createArgs = (args) => ({
  args,
});

const toCamelCase = (value) => value.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const isFunction = (value) => value instanceof Function;
const isObject = (value) => value instanceof Object;

const isFolderWithIndexFile = (value) => {
  if (!isObject(value)) {
    return false;
  }

  const keys = Object.keys(value);
  return keys.length === 1 && keys[0] === 'index';
};

const areNestedServices = (value) => isObject(value);

const exportServices = (services, servicesToExport, dependencies) => {
  Object.entries(services || {}).forEach(([name, value]) => {
    if (isFolderWithIndexFile(value)) {
      servicesToExport[toCamelCase(name)] = {
        ...value.index(dependencies),
      };
    } else if (isFunction(value)) {
      const buildedExport = value(dependencies);

      if (isFunction(buildedExport)) {
        servicesToExport[toCamelCase(name)] = buildedExport;
      } else if (isObject(buildedExport)) {
        Object.entries(buildedExport).forEach(([nestedName, nestedValue]) => {
          servicesToExport[toCamelCase(nestedName)] = nestedValue;
        });
      }
    } else if (areNestedServices(value)) {
      const nestedExport = {};
      servicesToExport[toCamelCase(name)] = nestedExport;
      exportServices(value, nestedExport, dependencies);
    }
  });
};

module.exports.init = (options) => {
  const services = {};

  const { database, ...noDatabase } = options;

  const dependencies = {
    ...database,
    ...noDatabase,
    services,
    createArgs,
  };

  exportServices(options.services, services, dependencies);
  return services;
};
