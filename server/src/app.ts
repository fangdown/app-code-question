/**
 */

'use strict';

import routes from './routes';
import * as config from './public/config';
import { createApp } from './public/framework';
// import middlewares from './middlewares';

const debug = require('debug')('app');
function create() {
  debug('create app');
  return createApp({
    routes,
    views: config.get('static.distDir') || '',
  });
}

export default { create };
