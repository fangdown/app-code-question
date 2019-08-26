/**
 * Remote API Request Client模块
 * 通过request-promise代理请求API
 */

import * as url from 'url';
import * as express from 'express';
import * as rp from 'request-promise';
import * as rq from 'request';
import * as config from '../config';
import * as logger from './logger';
import { ServiceError } from './error';
import ERROR_CODE from './error-code';
import SERVICE_CODE from './service-code';

const debug = require('debug')('framework:api');
const log = logger.get('framework:api');

const DEBUG = config.get('debug');
const serverName = config.get('name');
const serverVersion = config.get('version');
const apiTimeout = 1500;
const mock = config.get('mock');
const GATWAY_ERROR_MESSAGE: string = '请求接口错误';
const BODY_METHOD = ['POST', 'PUT', 'PATCH', 'DELETE'];
const requestLogger = logger.get('request:api');

type METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

interface RequestOptions {
  method?: METHOD;
  headers?: Record<string, string>;
  timeout?: number;
  parse?: boolean;
  json?: boolean;
  form?: boolean;
  encoding?: string | null;
}

interface Request {
  qs?: any;
  body?: any;
  form?: any;
  encoding?: string | null;
  readonly uri: string;
  readonly method: METHOD;
  readonly headers: Record<string, string>;
  readonly timeout: number;
  readonly json: boolean;
}

interface Response {
  code?: number | string;
  msg?: string;
  data?: any | null;
}

interface ClientError {
  statusCode?: number;
  message?: string;
  error?: string;
  nativeCode?: string | number;
}

interface StatusCodeError {
  status?: number;
  statusCode?: number;
  message?: string;
  error?: string;
}

interface NormalError {
  code: string | number;
  msg: string;
  nativeCode?: string | number;
  time?: number;
}

// function getMockUri(uri: string) {
//   if (!mock || !mock.enable) return uri;
//   const parsedUri = url.parse(uri);
//   const pathname = parsedUri.pathname || '';
//   for (const api of mock.apis) {
//     // api白名单支持正则表达式匹配
//     if (pathname === api || new RegExp(api).test(pathname)) {
//       uri = url.format({
//         protocol: 'http',
//         hostname: mock.host,
//         pathname: `/mock/${mock.repo}${pathname}`,
//         search: parsedUri.search,
//         hash: parsedUri.hash,
//       });
//       break;
//     }
//   }
//   return uri;
// }

function stringifyData(data: any) {
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
}

function formatDebugLog(req: Request, data: any | null) {
  const text = DEBUG && data ? stringifyData(data) : '';
  return `[${req.method}] ${req.uri} ${text}`;
}

function formatInfoLog(req: Request, code: string | number, msg: string) {
  return `[${req.method}] ${req.uri} ${code} - ${msg}`;
}

function getDebugLogData(req: Request, data: any | null) {
  return {
    method: req.method,
    path: req.uri,
    data: DEBUG && data ? stringifyData(data) : null,
  };
}

function getInfoLogData(
  req: Request,
  code: string | number,
  msg: string,
  time?: number
) {
  return {
    method: req.method,
    path: req.uri,
    data: req.qs ? stringifyData(req.qs) : null,
    code,
    message: msg,
    time: time !== void 0 ? `${time}ms` : undefined,
  };
}

function throwTimeout(req: Request) {
  const msg: string = '请求接口超时';
  const code = ERROR_CODE.GATEWAY_TIMEOUT;
  throwNormalError(req, { code, msg, time: apiTimeout });
}

// api后端返回的错误格式状态码+{data: null, msg: string, code: string}
function throwServerError(req: Request, res: Response, time?: number) {
  const code = ERROR_CODE.BAD_GATEWAY;
  const msg = res.msg || GATWAY_ERROR_MESSAGE;
  throwNormalError(req, { code, msg, nativeCode: res.code, time });
}

// 1.接口返回的错误是状态码+error
// 2.本地抛出的错误是Error对象
function throwClientError(req: Request, err: ClientError) {
  const code = err.statusCode || ERROR_CODE.BAD_GATEWAY;
  const msg = err.error || err.message || GATWAY_ERROR_MESSAGE;
  throwNormalError(req, { code, msg, nativeCode: err.nativeCode });
}

// Request StatusCodeError
function throwStatusCodeError(req: Request, err: StatusCodeError) {
  const code = err.status || err.statusCode || ERROR_CODE.BAD_GATEWAY;
  const msg = err.error || err.message || GATWAY_ERROR_MESSAGE;
  throwNormalError(req, { code, msg });
}

function throwNormalError(req: Request, err: NormalError) {
  const code = err.nativeCode || err.code;
  const logMessage = formatInfoLog(req, code, err.msg);
  const logData = getInfoLogData(req, code, err.msg, err.time);
  log.error(logMessage, logData);
  throw new ServiceError(SERVICE_CODE.API, +err.code, err.msg, err.nativeCode);
}

/**
 * 请求远程资源
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的查询参数
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function request(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  debug('request api "%s"', uri);

  // 当启用了Mock服务，则Mock对应的接口
  // 不在Mock apis白名单内的，不会受影响
  // if (mock && mock.enable) uri = getMockUri(uri);

  const req = getRequest(uri, data, options);
  log.debug(formatDebugLog(req, data), getDebugLogData(req, data));

  const startTime = Date.now();

  try {
    // create remote api request client
    requestLogger.info('java api:', uri);
    const res: Response = await rp(req);
    // 接口请求耗时统计
    const diffTime = Date.now() - startTime;

    debug('requested api "%s"', uri);
    log.debug(formatDebugLog(req, res), getDebugLogData(req, res));

    if (options.parse !== false) {
      if (!res) {
        const code = ERROR_CODE.BAD_GATEWAY;
        const msg = GATWAY_ERROR_MESSAGE;
        throw new ServiceError(SERVICE_CODE.API, code, msg);
      }

      // server error response
      if (!res.code || +res.code !== 200) {
        const code = ERROR_CODE.BAD_GATEWAY;
        const msg = res.msg || GATWAY_ERROR_MESSAGE;
        throw new ServiceError(SERVICE_CODE.API, code, msg, res.code);
      }
    }

    const code = (res && typeof res === 'object' && res.code) || 200;
    const msg = (res && typeof res === 'object' && res.msg) || 'OK';
    const prefix = ('' + code).charAt(0);
    // 根据状态码打日志级别
    // 3xx - warn
    // 4xx 5xx - error
    // other - info
    const level =
      prefix === '3' ? 'warn' : ['4', '5'].includes(prefix) ? 'error' : 'info';
    const logMessage = formatInfoLog(req, code, msg);
    const logData = getInfoLogData(req, code, msg, diffTime);
    log[level](logMessage, logData);
    return options.parse !== false ? res.data : res;
  } catch (err) {
    // request timeout
    if (err.cause && err.cause.code === 'ETIMEDOUT') {
      throwTimeout(req);
    }

    // Request StatusCodeError
    if (err.error && err.name === 'StatusCodeError') {
      throwStatusCodeError(req, err);
    }

    // server error response
    // api后端返回的错误格式状态码+{data: null, msg: 'xxx'}
    if (err.error && typeof err.error !== 'string') {
      const diffTime = Date.now() - startTime;
      throwServerError(req, err.error, diffTime);
    }

    // gateway or client error
    throwClientError(req, err);
  }
}

function getRequest(uri: string, data: any, options: RequestOptions) {
  const {
    method = 'GET',
    timeout = apiTimeout,
    headers = {},
    json = true,
    encoding,
  } = options;
  const hs = { 'user-agent': `${serverName}/${serverVersion}`, ...headers };
  const req: Request = { method, uri, headers: hs, timeout, json, encoding };

  // 表单数据，通过form传递
  if (options.form) {
    req.form = data;
  } else {
    // post/put/patch/delete的数据，都通过body传递
    if (BODY_METHOD.includes(method)) {
      req.body = data;
    } else {
      // get/head/options的数据，通过qs传递
      req.qs = data;
    }
  }
  return req;
}

/**
 * GET方法请求API数据
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的查询参数
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function get(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'GET';
  return await request(uri, data, options);
}

/**
 * POST方法调用API
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的实体数据
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function post(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'POST';
  return await request(uri, data, options);
}

/**
 * PUT方法调用API
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的实体数据
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function put(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'PUT';
  return await request(uri, data, options);
}

/**
 * patch方法调用API
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的实体数据
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function patch(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'PATCH';
  return await request(uri, data, options);
}

/**
 * DELETE方法调用API
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的实体数据
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function del(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'DELETE';
  return await request(uri, data, options);
}

/**
 * POST FormData数据
 * @param {string} uri      API地址
 * @param {*} [data={}]     需要传递给远程服务器的实体数据
 * @param {RequestOptions} [options={}]  额外的选项，比如headers等
 * @return {Promise<any>}
 */
export async function postFormData(
  uri: string,
  data = {},
  options: RequestOptions = {}
) {
  options.method = 'POST';
  options.form = true;
  return await request(uri, data, options);
}

/**
 * 代理请求，通过pipe流的方式完成请求代理
 * 此方法会把来自客户端的请求原封不动的代理到远程接口
 * 此方法设置了缓存控制为`no-cache`
 * @param {express.Request} req 来自客户端的请求
 * @param {express.Response} res 响应对象
 * @param {string} uri 远程接口
 * @param {RequestOptions} [options={}] 额外的选项，比如headers等
 */
export function proxy(
  req: express.Request,
  res: express.Response,
  uri: string,
  options: RequestOptions = {}
) {
  debug('proxy "%s"', uri);
  if (!options.method) options.method = req.method as METHOD;
  // 强制不要缓存数据
  options.headers = { ...options.headers, 'cache-control': 'no-cache' };
  const isBody = BODY_METHOD.includes(options.method);
  // 1.当是post put patch delete等请求，则从body中提取数据
  // 2.当是get head options等请求，则从query中提取数据
  const data = isBody ? req.body : req.query;
  const proxyReq = getRequest(uri, data, options);
  log.debug(formatDebugLog(proxyReq, data), getDebugLogData(proxyReq, data));
  // 当是post put patch delete等请求，需要指定end为false
  req
    .pipe(
      rq(proxyReq),
      { end: !isBody }
    )
    .pipe(res);
}
