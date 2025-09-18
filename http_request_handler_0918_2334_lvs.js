// 代码生成时间: 2025-09-18 23:34:11
const Hapi = require('@hapi/hapi');
# 增强安全性

// 创建一个新的 Hapi 服务器实例，并指定连接信息
const init = async () => {
  const server = Hapi.server({
# NOTE: 重要实现细节
    port: 3000,
    host: 'localhost'
  });
# 增强安全性

  // 定义一个简单的路由
# 扩展功能模块
  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return 'Hello, Hapi!';
    },
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 调用初始化函数
init();
