/**
 * 基于log4js的日志模块
 */

import * as log4js from 'log4js';
import * as express from 'express';
import * as config from '../config';

const debug = require('debug')('framework:logger');
const loggerConfig = config.get('logger');

/**
 * 日志初始化
 * 设置日志配置
 */
export function init() {
  debug('init logger');
  if (!loggerConfig || !loggerConfig.enable) return;
  const conf: log4js.Configuration = loggerConfig.configure;
  log4js.configure(conf);
}

/**
 * 获取日志对象
 * @param  {string} name
 * @return {log4js.Logger}
 */
export function get(name = 'default') {
  debug('get logger: %s', name);
  return log4js.getLogger(name);
}

/**
 * 返回中间件对象
 * @return {express.Handler}
 */
export function use(): express.Handler {
  debug('use logger: http');
  const logger = log4js.getLogger('http');
  return log4js.connectLogger(logger, { level: 'auto' });
}
