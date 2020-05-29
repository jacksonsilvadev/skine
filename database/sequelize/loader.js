const toCamelCase = (value) => value.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const iterateModels = (models, callback) => {
  const entries = Object.entries(models || {});
  return entries.map(([modelName, model]) => callback(modelName, model));
};

const importModels = (sequelize, models) => iterateModels(models, (name, model) => {
  const modelName = toCamelCase(name);
  return sequelize.import(modelName, model);
});

const associateModels = (models) => {
  iterateModels(models, (name, model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

module.exports = (options, sequelize) => {
  importModels(sequelize, options.models);
  associateModels(sequelize.models);
};
