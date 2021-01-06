const { Op } = require('sequelize');

const queryBuilders = require('./query-builders');
const connection = require('./connection');
const migrations = require('./migrations');
const loader = require('./loader');
const sync = require('./sync');

const transaction = async (sequelize, func, externalTransaction) => {
  const trx = externalTransaction || (await sequelize.transaction());

  try {
    const result = await func(trx);

    if (!externalTransaction) {
      await trx.commit();
    }

    return result;
  } catch (err) {
    if (!externalTransaction) {
      await trx.rollback();
    }

    throw err;
  }
};

module.exports = async (options) => {
  const sequelize = connection(options);
  loader(options, sequelize);

  await sync(options, sequelize);
  await migrations(options, sequelize);

  return {
    Op,
    models: sequelize.models,
    fn: sequelize.fn,
    col:sequelize.col,
    literal: sequelize.literal,
    where: sequelize.where,
    queryBuilders,
    inTransaction: (func, externalTransaction) => transaction(sequelize, func, externalTransaction),
  };
};
