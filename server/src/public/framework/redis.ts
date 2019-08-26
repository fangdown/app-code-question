/**
 * Redis常用方法封装
 * @author luoying
 * @since 17/08/12
 */

import * as IORedis from 'ioredis';
import * as config from '../config';
import * as logger from './logger';
import { ServiceError } from './error';
import ERROR_CODE from './error-code';
import SERVICE_CODE from './service-code';

const log = logger.get('framework:redis');
const debug = require('debug')('framework:redis');

// Redis Client实例列表
// 每个实例都有一个唯一的别名索引
// <可以初始化多个实例>
const redisClientList: Record<string, RPRedis> = {};

function getLogData(conf: any) {
  return (message?: string) => {
    return {
      alias: conf.alias,
      host: conf.server.host,
      port: conf.server.port || 6379,
      message,
    };
  };
}

export class RPRedis {
  name: string;

  /**
   * Redis Client是否准备就绪
   */
  isReady: boolean = false;

  /**
   * Redis Client实例
   */
  private client: IORedis.Redis | null;

  /**
   * Redis Client连接配置
   */
  private conf: any;

  /**
   * 创建Redis Client
   */
  constructor(conf: any) {
    this.conf = conf;
    this.name = conf.alias;
    this.client = this.create(conf);
  }

  create(conf: any) {
    debug('create `%s` redis', conf.alias);

    const _getLogData = getLogData(conf);

    if (!conf.enable) {
      const msg = 'Disabled';
      log.warn(`[${conf.alias}]: ${msg}`, _getLogData(msg));
      return null;
    }

    if (!conf.server || !conf.server.host) {
      const msg = `[${conf.alias}] Invalid Config`;
      throw new ServiceError(
        SERVICE_CODE.REDIS,
        ERROR_CODE.INTERNAL_SERVER_ERROR,
        msg
      );
    }

    const client = new IORedis(conf.server);

    client.on('connect', () => {
      const msg = 'Connected';
      debug('connect redis');
      this.isReady = true;
      log.info(`[${this.name}]: ${msg}`, _getLogData(msg));
    });

    client.on('ready', () => {
      const msg = 'Ready';
      debug('ready redis');
      this.isReady = true;
      log.info(`[${this.name}]: ${msg}`, _getLogData(msg));
    });

    client.on('reconnecting', () => {
      const msg = 'Reconnecting';
      debug('reconnecting redis');
      log.info(`[${this.name}]: ${msg}`, _getLogData(msg));
    });

    client.on('end', () => {
      const msg = 'Closed';
      debug('end redis');
      log.warn(`[${this.name}]: ${msg}`, _getLogData(msg));
      this.isReady = false;
    });

    client.on('error', (err: Error) => {
      console.error(this.name, err);
      log.error(`[${this.name}] - ${err.message}`, _getLogData(err.message));
      this.isReady = false;
    });

    return client;
  }

  private checkRedisStatus() {
    if (!this.conf.enable) {
      const msg = `[${this.name}]: Disabled`;
      throw new ServiceError(
        SERVICE_CODE.REDIS,
        ERROR_CODE.INTERNAL_SERVER_ERROR,
        msg
      );
    }

    if (!this.client) {
      const msg = `[${this.name}]: Not Created`;
      throw new ServiceError(
        SERVICE_CODE.REDIS,
        ERROR_CODE.INTERNAL_SERVER_ERROR,
        msg
      );
    }

    if (!this.isReady) {
      const msg = `[${this.name}]: Not Ready`;
      throw new ServiceError(
        SERVICE_CODE.REDIS,
        ERROR_CODE.INTERNAL_SERVER_ERROR,
        msg
      );
    }
    return true;
  }

  private async wrap(name: string, ...rest: any[]) {
    try {
      if (!this.client || !this.checkRedisStatus()) return null;
      const executor = this.client;
      return await (executor as any)[name](...rest);
    } catch (err) {
      // 捕捉错误并上报，不阻断代码执行
      console.error(name, err);
      log.error(`[${name.toUpperCase()}] - ${err.message}`);
      return null;
    }
  }

  /**
   * 设置缓存有效期
   * @param  {string} key    缓存key
   * @param  {number} expire 有效期，秒
   * @returns {Promise<number>}
   */
  async expire(key: string, expire: number): Promise<number> {
    if (!expire || !this.client) return 0;
    // NOTE:
    // redis v2.6.12以下不支持通过`set(key, data, 'EX', expire)`的方式设置缓存有效期
    // 故：调用`expire`方法设置缓存有效期
    return await this.client.expire(key, expire);
  }

  /**
   * 获取缓存数据
   * @param {string} key    缓存数据的key
   * @return {Promise<string>}
   */
  async get(key: string): Promise<string | null> {
    if (!key) return null;
    debug('get cache: %s', key);
    log.debug(`[GET] ${key}`);
    return await this.wrap('get', key);
  }

  /**
   * 返回hash对象中指定字段的值
   * @param {string} key    缓存数据hash对象
   * @param {string} field  hash对象中的字段
   * @return {Promise<string | null>}
   */
  async hget(key: string, field: string): Promise<string | null> {
    if (!key || !field) return null;
    debug('hget cache: %s.%s', key, field);
    log.debug(`[HGET] ${key}.${field}`);
    return await this.wrap('hget', key, field);
  }

  /**
   * 获取多个key的缓存数据
   * @param {string[]} keys    任意多个key
   * @return {Promise<string[]>}
   */
  async mget(keys: string[]): Promise<string[]> {
    if (!keys.length) return [];
    debug('mget cache: [%s]', keys);
    log.debug(`[MGET] [${keys}]`);
    return await this.wrap('mget', keys);
  }

  /**
   * 保存缓存数据
   * @param {string} key        缓存数据的key
   * @param {string} value      被缓存的数据值
   * @param {number} [expire=0] 缓存有效期，秒
   * @return {Promise<string | null>}
   */
  async set(key: string, value: string, expire = 0): Promise<string | null> {
    if (!key) return null;
    debug('set cache: %s', key);
    log.debug(`[SET] ${key}`);
    return await this.wrap('set', key, value, 'EX', expire);
  }

  /**
   * 保存hash对象中指定字段的值
   * @param {string} key        缓存数据hash对象
   * @param {string} field      hash对象中的字段
   * @param {string} value      被缓存的数据
   * @param {number} [expire=0] 缓存有效期，秒
   * @return {Promise<number | null>}
   */
  async hset(key: string, field: string, value: string, expire = 0) {
    if (!key || !field) return null;
    debug('hset cache: %s.%s', key, field);
    log.debug(`[HSET] ${key}.${field}`);
    const result: number = await this.wrap('hset', key, field, value);
    await this.expire(`${key}.${field}`, expire);
    return result;
  }

  /**
   * 保存多个键值对缓存数据
   * @param {any[]} [data=[]]   键值对数组，[[key1, val1], [key2, val2]]
   * @param {Number} [expire=0] 缓存有效期，秒
   * @return {Promise<string | null>}
   */
  async mset(data: any[], expire = 0) {
    if (!data.length) return null;
    const keys: string[] = data.map((item: [string, string]) => item[0]);
    debug('mset cache: [%s]', keys);
    log.debug(`[MSET] [${keys}]`);
    const result: string = await this.wrap('mset', ...data);
    if (expire) {
      for (const item of data) {
        this.expire(item[0], expire);
      }
    }
    return result;
  }

  /**
   * 删除指定的缓存数据
   * 这是一个async/await异步方法
   * @param {string} key    缓存数据的key
   * @return {Promise<number>}
   */
  async del(...keys: string[]): Promise<number> {
    if (!keys || !keys.length) return 0;
    debug('delete cache: %s', ...keys);
    log.debug(`[DELETE] ${keys}`);
    return await this.wrap('del', keys);
  }

  /**
   * 获取client
   */
  public getClient() {
    return this.client;
  }
}

/**
 * 初始化所有redis服务器连接
 */
export function init() {
  const conf = config.get('redis');
  if (!conf || !Object.keys(conf).length) {
    log.warn('Redis Module: Not Found Any Redis');
    return;
  }

  for (const name in conf) {
    // const item = conf[name] ;
    // redisClientList[item.alias] = new RPRedis(item);
  }
}

/**
 * 获取已创建的Redis Client实例
 * @param  {config.RedisItem} item     Redis server item
 * @return {RPRedis | null}
 */
export function get(item: any) {
  const instance: RPRedis | undefined = redisClientList[item.alias];
  if (!instance) {
    const errorMsg = `[${item.alias}]: Not Exist`;
    const err = new ServiceError(
      SERVICE_CODE.REDIS,
      ERROR_CODE.INTERNAL_SERVER_ERROR,
      errorMsg
    );
    console.error(err);
    log.error(err.message, getLogData(item)(err.message));
    return null;
  }
  return instance;
}

/**
 * 获取缓存KEY
 * @param {string} prefix 分类前缀
 * @param {string} val 唯一值
 * @returns {string} 返回唯一的KEY
 */
export function getKey(prefix: string, val: string) {
  return `${prefix}_${val}`;
}
