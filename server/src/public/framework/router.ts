/**
 * 基础框架路由器
 */

import * as express from 'express';

// 创建Router
export function createRouter(): express.Router {
  return express.Router();
}
