/**
 * 会话管理模块
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as config from '../config';
import * as api from './api';

const RedisStore = connectRedis(session);

const sessionConfig = config.get('session');
const apiHost = config.get('api.host');

/**
 * 用户信息模型
 * @interface UserInfo
 */
export interface UserInfo {
  userHid: string; // 虎鲸id
  [x: string]: any;
}

export interface NSession extends Express.Session {
  userInfo?: UserInfo | null;
}

// 前后端不同key字段映射表
// 后端在前，前端在后
const USER_FIELD_MAP: Record<string, string> = {
  ssoUserId: 'userHid',
};

function emptyRequestHandler(req: Request, res: Response, next: NextFunction) {
  next();
}

/**
 * 创建新的会话中间件
 * @returns {RequestHandler}
 */
export function createSession(): RequestHandler {
  if (!sessionConfig) return emptyRequestHandler;
  return session();
  // const redisStore = new RedisStore(sessionConfig.store);
  // return session({ ...sessionConfig, store: redisStore });
}

/**
 * 重新载入当前用户会话的中间件。
 * 例如：在请求直出页面的路由时，可以加上此中间件，强制重载当前用户会话，尽可能早地拿到用户信息。
 *
 * @export
 * @param {(string[] | RegExp[])} [ignores=[]] 忽略重载会话的请求path，可以是正则表达式
 * @returns  {RequestHandler}
 */
export function reloadSession(ignores: string[] | RegExp[] = []) {
  // 返回express中间件
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const i of ignores) {
      // 当是被忽略的请求，则直接进入下一个中间件
      if ((i instanceof RegExp && i.test(req.path)) || i === req.path) {
        next();
        return;
      }
    }
    try {
      // 刷新当前用户的会话，然后再进入下一个中间件
      await refreshSession(req);
    } catch (err) {}
    next();
  };
}

/**
 * 刷新当前会话
 * 1.重新请求用户信息
 * @param {Request} req 客户端请求
 * @returns {Promise<Express.Session>}
 */
export async function refreshSession(
  req: Request
): Promise<NSession | undefined> {
  const userInfo = await requestUserInfo(req.get('cookie'));
  if (req.session) {
    req.session.userInfo = userInfo;
  }
  return req.session;
}

// 根据cookie请求用户信息
async function requestUserInfo(cookie = '') {
  const uri = `${apiHost}/api/usercenter/sso/getUserInfoByCookie`;
  const headers = { cookie, 'cache-control': 'no-cache' };
  const data = await api.get(uri, undefined, { headers });
  return parseUserInfo(data);
}

/**
 * 格式化用户数据
 * 1.不同名key，映射一下
 * 2.同名key，保留
 * @param {*} data
 * @returns {UserInfo}
 */
function parseUserInfo(data: any) {
  const userInfo = {} as UserInfo;
  for (const key in data) {
    const v = data[key];
    if (USER_FIELD_MAP[key]) {
      userInfo[USER_FIELD_MAP[key]] = v;
      continue;
    }
    userInfo[key] = v;
  }
  return userInfo;
}

/**
 * 清除当前会话
 * @param {Request} req 客户端请求
 * @returns {Promise<boolean>}
 */
export function clearSession(req: Request) {
  return new Promise<boolean>(resolve => {
    if (!req.session) {
      resolve(true);
      return;
    }
    req.session.destroy(err => resolve(!err));
  });
}

/**
 * 从会话管理中获取客户端请求的用户ID
 * @param {Request} req 客户端请求
 * @returns {string}
 */
export function getUserId(req: Request): string {
  if (!req.session || !req.session.userInfo) return '';
  return req.session.userInfo.userId;
}

/**
 * 从会话管理中获取客户端请求的用户信息
 * @param {Request} req 客户端请求
 * @returns {UserInfo | null}
 */
export function getUserInfo(req: Request): UserInfo | null {
  if (!req.session || !req.session.userInfo) return null;
  return req.session.userInfo;
}
