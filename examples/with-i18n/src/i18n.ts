import i18n from 'i18next'
import backend from 'i18next-xhr-backend';

const options = {
  fallbackLng: 'zh',
  load: 'languageOnly' as 'languageOnly',
  ns: ['translations'],
  defaultNS: 'translations',
  debug: false,
  saveMissing: true,
  detection: {
    order: ['querystring', 'cookie'],
    caches: ['cookie']
  },
}


if (process.env) {
  
}

if (!i18n.isInitialized) i18n.use(backend).init(options);

export default i18n
