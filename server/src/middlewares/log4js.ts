const log4js = require('log4js');
log4js.configure({
  appenders: {
    infoLogs: {
      type: 'dateFile',
      //文件名为= filename + pattern, 设置为alwaysIncludePattern：true
      filename: 'server/logs/info/file',
      pattern: 'yyyy-MM-dd.log',
      //包含模型
      alwaysIncludePattern: true,
    },
    errorLogs: {
      type: 'file',
      filename: 'server/logs/error/file.log',
      maxLogSize: 10485760,
      backups: 20,
      compress: true,
    },
    justErrors: {
      type: 'logLevelFilter', // 过滤指定level的文件
      appender: 'errorLogs', // appender
      level: 'error', // 过滤得到error以上的日志
    },
    console: { type: 'console' },
  },
  categories: {
    default: {
      appenders: ['console', 'justErrors', 'infoLogs'],
      level: 'info',
    },
    err: { appenders: ['errorLogs'], level: 'error' },
  },
});

module.exports = {
  logger: function(name?: string, level?: Record<string, any>) {
    const logger = log4js.getLogger(name, level);
    return logger;
  },
  use: function(app: any) {
    const logger = log4js.getLogger();
    app.use(log4js.connectLogger(logger, { level: 'info' }));
  },
};
