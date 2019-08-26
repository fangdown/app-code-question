import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../error';
import ERROR_CODE from '../error-code';
import SERVICE_CODE from '../service-code';

/**
 * 404 Not Found 中间件
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default function(req: Request, res: Response, next: NextFunction) {
  const err = new ServiceError(
    SERVICE_CODE.SYSTEM,
    ERROR_CODE.NOT_FOUND,
    'Not Found'
  );
  next(err);
}
