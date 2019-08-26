import { Request, Response, NextFunction, RequestHandler } from 'express';
const log4js = require('../middlewares/log4js');
const logger = log4js.logger();

class ServiceError extends Error {
  /**
   * 返回包装后的错误对象
   * @param  {string} [service='UNKONWN']    服务代码
   * @param  {ERROR_CODE} [status='500' ]   状态码
   * @param  {string} [msg='未知错误']        状态消息
   * @return {ServiceError}
   */
  // constructor(service = service_code_1.default.UNKONWN, status = error_code_1.default.INTERNAL_SERVER_ERROR, msg = '未知错误', nativeCode) {
  //     super(msg);
  //     const svrcode = service || service_code_1.default.UNKONWN;
  //     const code = svrcode + status;
  //     this.code = code;
  //     this.status = status;
  //     this.nativeCode = nativeCode;
  // }
}
exports.ServiceError = ServiceError;

function catchError(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('node api:', req.baseUrl + req.route.path);
      return await handler(req, res, next);
    } catch (err) {
      logger.error(err.message);
      console.error(err.message);
      // 数据库查询抛出的错误，隐藏数据库敏感错误信息
      next(err);
    }
  };
}
exports.catchError = catchError;
