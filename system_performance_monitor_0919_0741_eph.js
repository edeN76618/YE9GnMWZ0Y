// 代码生成时间: 2025-09-19 07:41:37
const Hapi = require('@hapi/hapi');
const os = require('os-utils');
const Good = require('@hapi/good');
const path = require('path');

// 创建一个Hapi服务器实例
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 插件注册
  await server.register({
    plugin: Good,
    options: {
      reporters: {
        myConsoleReporter: {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            stats: '*'
          }],
          config: {
            ops: { interval: 1000 },
            response: {
              sample: 100,
              max: 100,
            },
            }
          },
        consoleReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [{ response: '*' }]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  });

  // 定义监控端点
  server.route({
    method: 'GET',
    path: '/performance',
    handler: async (request, h) => {
      try {
        // 获取系统信息
        const cpuLoad = await getCpuLoad();
        const memoryUsage = await getMemoryUsage();
        const uptime = await getUptime();

        // 返回系统性能数据
        return h.response({
          cpuLoad: cpuLoad,
          memoryUsage: memoryUsage,
          uptime: uptime
        });
      } catch (error) {
        // 错误处理
        return h.response(error).code(500);
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log('Server running at:', server.info.uri);
};

// 获取CPU负载
const getCpuLoad = () => {
  return new Promise((resolve, reject) => {
    os.cpuLoad(function (average) {
      resolve(average);
    }, 1000);
  });
};

// 获取内存使用情况
const getMemoryUsage = () => {
  return new Promise((resolve, reject) => {
    os.freemem(function (freeMemory) {
      const totalMemory = os.totalmem();
      const usedMemory = totalMemory - freeMemory;
      resolve(usedMemory);
    });
  });
};

// 获取系统运行时间
const getUptime = () => {
  return new Promise((resolve, reject) => {
    os.uptime(function (uptime) {
      resolve(uptime);
    });
  });
};

// 错误处理中间件
const errorHandling = (err, request, h) => {
  return h.response({
    status: err.statusCode,
    error: err.message,
    stack: err.stack
  }).code(err.statusCode);
};

init().catch(err => {
  console.error('Server failed to start:', err);
});