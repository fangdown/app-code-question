const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const debug = require('debug')('config');
//////////////// ts 类型声明结束 //////////////////
// 运行时环境，默认值：prod
let runtimeEnv = 'prod';
// 统一配置中心
// 组合了通用配置和业务配置的全部配置
let config: any;

function parsePath(filename: string) {
  return path.resolve(__dirname, `./data/${filename}`);
}
// 解析配置内容
// 将与环境关联的配置项解析出来（选取当前环境的对应配置值）
function parseConf(conf: any) {
  const type = Object.prototype.toString.call(conf);
  if (type !== '[object Object]') return conf;
  if (conf.prod) return conf[runtimeEnv];
  for (const key in conf) conf[key] = parseConf(conf[key]);
  return conf;
}
// 创建配置中心
// 由yaml配置文件转换为json配置库
function createConf() {
  // 独立处理global.yaml
  const gloablConf = loadYaml(parsePath('global.yaml'), (conf: any) => {
    if (process.env.NODE_ENV) conf.NODE_ENV = process.env.NODE_ENV;
    if (process.env.PORT) conf.port = +process.env.PORT;
    conf.debug = conf.NODE_ENV === 'development';
    parseConf(conf);
    return conf;
  });
  // 自动读取所有配置文件，并解析、合并到统一的配置中心
  const yamls = fs.readdirSync(path.resolve(__dirname, './data'));
  for (const yml of yamls) {
    const name = yml.replace(/\.(yaml|yml)/i, '').replace(/-/g, '_');
    if (name === 'global') continue;
    const conf = loadYaml(parsePath(yml), parseConf);
    Object.assign(gloablConf, { [name]: conf });
  }
  return gloablConf;
}
/**
 * 加载yaml配置文件，转换为json配置库
 */
function loadYaml(filename: string, parse: any) {
  const content = fs.readFileSync(filename, 'utf8');
  let data = yaml.safeLoad(content);
  if (parse) data = parse(data);
  return data;
}

/**
 * 加载json配置文件
 */
function loadJSON(filename: string) {
  const content = fs.readFileSync(filename, 'utf8');
  return JSON.parse(content);
}
function mergeConf(conf1: any, conf2: any) {
  for (const key in conf2) {
    const val = conf2[key];
    const type = Object.prototype.toString.call(val);
    if (type === '[object Object]') {
      if (!conf1[key]) conf1[key] = {};
      mergeConf(conf1[key], val);
      continue;
    }
    conf1[key] = val;
  }
}
/**
 * 装载配置中心
 * 组合业务项目的配置
 * @param {string} [serverConfPath] 业务项目服务端配置文件
 * @param {string} [staticConfPath] 业务项目静态端配置文件
 * @param {string} [packagePath] 业务项目package.json文件
 * @param {string} [outConfPath] 装载后的配置内容输出到的文件
 * @returns {Config} 返回装载完毕的全部配置
 */
export function load(
  serverConfPath: string,
  staticConfPath: string,
  packagePath: string,
  outConfPath: string
) {
  debug('load config');
  const serverConf = serverConfPath ? loadJSON(serverConfPath) : {};
  const staticConf = staticConfPath ? loadJSON(staticConfPath) : {};
  const packageConf = packagePath ? loadJSON(packagePath) : {};
  // 优先级最高的是环境变量中的RUNTIME_ENV
  // 其次是服务端配置文件中的RUNTIME_ENV
  // 最后是程序中默认的RUNTIME_ENV
  if (serverConf && serverConf.RUNTIME_ENV) {
    runtimeEnv = serverConf.RUNTIME_ENV;
  }
  if (process.env.RUNTIME_ENV) {
    runtimeEnv = process.env.RUNTIME_ENV;
  }
  // 老local修改为dev
  if (runtimeEnv === 'local') runtimeEnv = 'dev';
  serverConf.RUNTIME_ENV = runtimeEnv;
  // 创建并初始化配置中心
  // 1.由yaml文件转换为json数据
  // 2.根据运行时环境变量初始化配置内容
  config = createConf();
  // 合并var/server.config.json配置
  if (serverConf) {
    mergeConf(config, serverConf);
  }
  // 合并var/static.config.json配置
  if (staticConf) {
    mergeConf(config, { static: staticConf });
  }
  if (packageConf) {
    config.name = packageConf.name;
    config.version = packageConf.version;
  }
  // 设置缺省main_host配置
  if (!config.main_host) {
    config.main_host = `http://${config.host}:${config.port}`;
  }
  // 当logstash日志没有配置service字段时，用当前项目名作为默认值
  const logstashKey = 'logger.configure.appenders.logstash.fields.service';
  if (!getInternally(config, logstashKey)) {
    setInternally(config, logstashKey, config.name);
  }
  debug('write config');
  // 输出配置文件
  const configFile = outConfPath || path.resolve(__dirname, './config.json');
  fs.writeFileSync(configFile, JSON.stringify(config, null, '  '), 'utf8');
  console.info('[CONFIG] The Configuration Center Has Been Loaded.');
  if (process.env.NODE_ENV === 'development') {
    // 打印配置中心内容，方便在控制台查看配置内容
    console.info(JSON.stringify(config));
  }
  return config;
}
function setInternally(conf: any, key: string, value: any) {
  debug('set config "%s"', key);
  const keys = key.split('.');
  const valKey = keys[keys.length - 1];
  let result = conf;
  for (let i = 0; i < keys.length - 1; i++) {
    result = result[keys[i]];
    if (result == null) break;
  }
  const type = Object.prototype.toString.call(result);
  if (result && type === '[object Object]') result[valKey] = value;
}
export function getInternally(conf: any, key: string) {
  if (!conf) return;
  const keys = key.split('.');
  let result = conf;
  for (const k of keys) {
    result = result[k];
    if (result == null) return null;
  }
  return result;
}
export function get(key: string) {
  return getInternally(config, key);
}
export function set(key: string, value: any) {
  setInternally(config, key, value);
}
