import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import * as config from '../../config';
import * as logger from '../logger';
import * as response from '../response';
import { ServiceError } from '../error';
import ERROR_CODE from '../error-code';
import SERVICE_CODE from '../service-code';

const log = logger.get('framework:application');

const DEBUG = config.get('debug');

/**
 * 错误处理中间件
 * @param {ErrorRequestHandler} [errorHandler] 自定义错误处理中间件
 * @returns {ErrorRequestHandler}
 */
export default function(errorHandler?: ErrorRequestHandler) {
  return (
    err: ServiceError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!err.status) err.status = ERROR_CODE.INTERNAL_SERVER_ERROR;
    if (!err.code) err.code = SERVICE_CODE.UNKONWN + err.status;
    console.error(req.path, err);
    const logData = {
      method: req.method,
      path: req.path,
      code: err.code,
      message: err.message || '服务器错误',
    };
    log.error(`${req.path} ${err.code} - ${logData.message}`, logData);

    // use custom error handler
    if (errorHandler) {
      errorHandler(err, req, res, next);
      return;
    }

    // use default error handler

    const msg = DEBUG ? err.stack : err.message;
    const accept = req.get('accept') || '';

    // json accept or api request
    if (/application\/json/i.test(accept) || /^\/api\//.test(req.originalUrl)) {
      response.error(res, err);
      return;
    }

    // html response
    const body = `<h1>${err.code}</h1><h2>${err.message}</h2><p>${msg}</p>`;
    res.status(err.status).send(body);
  };
}
