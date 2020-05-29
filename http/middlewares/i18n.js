const path = require('path');
const i18n = require('i18n');

const directory = path.join(__dirname, '..', '..', 'locales');

module.exports = () => async (req, res, next) => {
  req.i18n = {};

  i18n.configure({
    locales: ['pt-BR', 'en-US'],
    fallbacks: {
      pt: 'pt-BR',
      en: 'en-US',
    },
    defaultLocale: 'pt-BR',
    directory,
    register: req.i18n,
  });

  next();
};
