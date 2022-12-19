import { join } from 'path';

export default {
  languages: ['en', 'ro'],
  defaultLanguage: 'en',
  MISSING_KEY: 'MISSING_KEY',
  interpolation: {
    start: '{{',
    end: '}}',
  },
  dirPath: join(__dirname, '../../microservices/frontend-web/libs/i18n'),
};
