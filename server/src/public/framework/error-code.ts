/**
 * 错误码定义
 * 参照http status
 */

enum ERROR_CODE {
  /**
   * 错误请求：例如参数错误
   */
  BAD_REQUEST = 400,
  /**
   * 授权请求
   */
  UNAUTHORIZED = 401,
  /**
   * 被拒绝的请求
   */
  FORBIDDEN = 403,
  /**
   * 不存在的资源
   */
  NOT_FOUND = 404,
  /**
   * 是不允许的请求方法
   */
  METHOD_NOT_ALLOWED = 405,
  /**
   * 不能处理的Content-Type要求
   */
  NOT_ACCEPTABLE = 406,
  /**
   * 客户端请求超时，客户端未能在服务器预备等待的时间内完成一个请求的发送
   */
  REQUEST_TIMEOUT = 408,
  /**
   * 客户端必须发送Content-Length首部
   */
  LENGTH_REQUIRED = 411,
  /**
   * 请求体太大
   */
  REQUEST_ENTITY_TOO_LARGE = 413,
  /**
   * 请求URI太长，不予接受
   */
  REQUEST_URI_TOO_LONG = 414,
  /**
   * 服务器错误
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * 功能未实现
   */
  NOT_IMPLEMENTED = 501,
  /**
   * REST网关错误
   */
  BAD_GATEWAY = 502,
  /**
   * 服务不可用：例如正在更新服务器
   */
  SERVICE_UNAVAILABLE = 503,
  /**
   * REST网关超时
   */
  GATEWAY_TIMEOUT = 504,
}

export default ERROR_CODE;
