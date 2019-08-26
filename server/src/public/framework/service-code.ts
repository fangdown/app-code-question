/**
 * 服务模块代码定义
 */

enum SERVICE_CODE {
  /**
   * 未知模块
   */
  UNKONWN = '00000',
  /**
   * 系统模块
   */
  SYSTEM = '00100',
  /**
   * API模块
   */
  API = '00200',
  /**
   * DB模块
   */
  DB = '00300',
  /**
   * Redis缓存模块
   */
  REDIS = '00400',
  /**
   * 数据层模块
   */
  DATA = '00500',
  /**
   * 素材模块
   */
  MATERIAL = '01300',
  /**
   * 支付模块
   */
  PAY = '01400',
  /**
   * 阿里OSS模块
   */
  OSS = '01600',
}

export default SERVICE_CODE;
