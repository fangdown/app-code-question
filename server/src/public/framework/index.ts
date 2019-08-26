/**
 * Application框架入口
 * 1.初始化基础框架
 * 2.启动应用服务器监听
 */

'use strict';

import * as config from '../config';
import * as api from './api';
import * as express from 'express';
import * as logger from './logger';
import * as redis from './redis';
import * as response from './response';
import * as session from './session';
// import * as permission from './permission';
import { createApp } from './app';
import { createRouter } from './router';
import ERROR_CODE from './error-code';
import SERVICE_CODE from './service-code';
import { ServiceError, catchError } from './error';

const log = logger.get('framework');
const debug = require('debug')('framework');

/**
 * 初始化基础框架
 * 1.初始化日志服务
 * 2.初始化数据库
 * 3.创建Redis连接
 */
export function init() {
  debug('init framework');

  // 初始化日志服务
  logger.init();

  // 初始化Redis连接
  // redis.init();
}

/**
 * 启动web服务器
 * 服务器程序是传入的app实例
 * @param  {express.Express} app app实例
 */
export function start(app: express.Express) {
  debug('start server');
  const port: number = app.get('port');
  const host: string = app.get('host');
  app.listen(port, () => {
    debug('listening server');
    const serverName = config.get('name');
    const serverVersion = config.get('version');
    log.info(
      `[${serverName}/${serverVersion}] http://${host} listening on ${port}`
    );
  });
}

// 集中导出所有模块
export { api };
export { logger };
export { express };
export { redis };
export { response };
export { session };
// export { permission };
export { createApp };
export { createRouter };
export { ERROR_CODE };
export { SERVICE_CODE };
export { ServiceError, catchError };
