/**
 * 错误对象包装
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import ERROR_CODE from './error-code';
import SERVICE_CODE from './service-code';
const logger = require('./logger');
const requestLogger = logger.get('request:api');

export class ServiceError extends Error {
  /**
   * 错误码：服务代码+状态码
   */
  code: string;

  /**
   * 状态码，参照http status code
   */
  status: ERROR_CODE;

  nativeCode?: string | number;

  /**
   * 返回包装后的错误对象
   * @param  {string} [service='UNKONWN']    服务代码
   * @param  {ERROR_CODE} [status='500' ]   状态码
   * @param  {string} [msg='未知错误']        状态消息
   * @return {ServiceError}
   */
  constructor(
    service: SERVICE_CODE | string = SERVICE_CODE.UNKONWN,
    status: ERROR_CODE | number = ERROR_CODE.INTERNAL_SERVER_ERROR,
    msg = '未知错误',
    nativeCode?: string | number
  ) {
    super(msg);
    const svrcode = service || SERVICE_CODE.UNKONWN;
    const code = svrcode + status;
    this.code = code;
    this.status = status;
    this.nativeCode = nativeCode;
  }
}

/**
 * 错误捕捉代理函数
 * @param {RequestHandler} handler 真实的request处理函数
 */
export function catchError(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      requestLogger.info('node api:', req.baseUrl + req.route.path);
      return await handler(req, res, next);
    } catch (err) {
      console.error(err.message);
      // 数据库查询抛出的错误，隐藏数据库敏感错误信息
      if (err.sql) {
        const msg: string = err.sqlMessage;
        const sqlError = new ServiceError(
          SERVICE_CODE.DB,
          ERROR_CODE.INTERNAL_SERVER_ERROR,
          msg
        );
        sqlError.stack = err.stack;
        next(sqlError);
        return;
      }
      next(err);
    }
  };
}
