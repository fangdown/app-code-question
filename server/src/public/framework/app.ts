/**
 * Application框架
 */

'use strict';

import * as express from 'express';
import {
  Application,
  Router,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';

import * as config from '../config';
import * as logger from './logger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import notFoundHandler from './middlewares/404';
import errorHandler from './middlewares/error';

const debug = require('debug')('framework:application');

const host = config.get('host');
const port = config.get('port');
const NODE_ENV = config.get('NODE_ENV');
const RUNTIME_ENV = config.get('RUNTIME_ENV');

export interface AppSettings {
  /**
   * 业务方定义的路由列表
   * @type {(Record<string, Router | RequestHandler>)}
   * @memberof AppSettings
   */
  readonly routes?: Record<string, Router | RequestHandler>;
  /**
   * 业务方扩展的中间件
   * @type {RequestHandler[]}
   * @memberof AppSettings
   */
  readonly middlewares?: RequestHandler[];
  /**
   * 业务方定义的模板视图所在目录路径
   * @type {string}
   * @memberof AppSettings
   */
  readonly views?: string;
  readonly styleRules?: string;
  /**
   * 业务方定义的错误捕捉器，可以自行渲染错误页面
   * @type {ErrorRequestHandler}
   * @memberof AppSettings
   */
  readonly errorHandler?: ErrorRequestHandler;
  /**
   * 业务方预中间件
   * @memberof AppSettings
   */
  readonly premiddlewares?: (app: Application) => void;
  readonly middlewareStartHook?: (app: Application) => void;
  readonly middlewareEndHook?: (app: Application) => void;
}

/**
 * 创建并初始化Express Application
 * @param {Application} app Express Application
 * @param  {AppSettings} settings   App设置项
 * @returns {Application}
 */
export function createApp(settings: AppSettings) {
  debug('create express app');

  const app = express();

  const {
    routes = {},
    middlewares = [],
    premiddlewares,
    views = './views',
    middlewareStartHook,
    middlewareEndHook,
  } = settings;

  // 初始化预中间件
  if (premiddlewares) premiddlewares(app);

  // view engine setup
  // use ejs engine
  app.set('views', views);
  app.set('view engine', 'ejs');
  // 同时也支持将html文件作为ejs模板来渲染
  // app.engine('html', ejs.renderFile);

  app.set('host', host);
  app.set('port', port);
  app.set('NODE_ENV', NODE_ENV);
  app.set('RUNTIME_ENV', RUNTIME_ENV);

  app.use(logger.use());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(cookieParser());

  if (middlewareStartHook) middlewareStartHook(app);

  // use all middlewares
  for (const middleware of middlewares) {
    if (typeof middleware !== 'function') continue;
    app.use(middleware);
  }

  // use all routes
  for (const route in routes) {
    const handle = routes[route];
    if (typeof handle !== 'function') continue;
    app.use(route, handle);
  }

  if (middlewareEndHook) middlewareEndHook(app);

  // catch 404
  app.use(notFoundHandler);

  // catch any error
  app.use(errorHandler(settings.errorHandler));

  return app;
}
