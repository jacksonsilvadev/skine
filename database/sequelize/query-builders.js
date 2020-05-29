const { Op } = require('sequelize');

const isNotEmptyArray = (array) => {
  const isArray = Array.isArray(array);
  return !isArray || array.length > 0;
};

const where = (fields) => {
  const whereArgs = {};
  Object.keys(fields).forEach((key) => {
    if (
      (typeof fields[key] === 'boolean' || fields[key])
      && isNotEmptyArray(fields[key])
    ) {
      whereArgs[key] = fields[key];
    }
  });

  return whereArgs;
};

const whereDate = (startDate, endDate) => {
  if (startDate && endDate) {
    return {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    };
  } if (!startDate && endDate) {
    return {
      [Op.lte]: endDate,
    };
  } if (startDate && !endDate) {
    return {
      [Op.gte]: startDate,
    };
  }
  return null;
};

const getOrDefault = (value, defaultVal) => (value || defaultVal);

const pagination = (paginationInput) => {
  const limit = getOrDefault(paginationInput.limit, 50);
  const offset = getOrDefault(paginationInput.offset, 0);
  return { limit, offset };
};

module.exports = {
  where, whereDate, getOrDefault, pagination, Op,
};
