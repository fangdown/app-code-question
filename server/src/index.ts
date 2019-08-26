import * as path from 'path';
import * as config from './public/config';
const debug = require('debug')('APP');
debug('start app');

// 装载配置中心
config.load(
  path.resolve(__dirname, '../../var/server.config.json'),
  path.resolve(__dirname, '../../var/static.config.json'),
  path.resolve(__dirname, '../../package.json'),
  path.resolve(__dirname, '../../config.json')
);

const framework = require('./public/framework');
const app = require('./app').default;

framework.init();
const server = app.create();
framework.start(server);
