// 代码生成时间: 2025-09-22 14:02:47
const Hapi = require('@hapi/hapi');

// 创建一个新的Hapi服务器实例，并设置端口为3000
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// 定义数学计算工具集的路由和逻辑
const mathRoutes = {
  method: 'GET',
  path: '/math/{operation}',
  options: {
    handler: async (request, h) => {
      const { operation } = request.params;
      const a = parseFloat(request.query.a);
      const b = parseFloat(request.query.b);
      
      // 错误处理：确保传入的a和b是有效的数字
      if (isNaN(a) || isNaN(b)) {
        return h.response({
          status: 'error',
          message: 'Invalid input. Please provide valid numbers for a and b.',
        }).code(400);
      }
      
      try {
        switch (operation) {
          case 'add':
            return {
              status: 'success',
              result: a + b,
            };
          case 'subtract':
            return {
              status: 'success',
              result: a - b,
            };
          case 'multiply':
            return {
              status: 'success',
              result: a * b,
            };
          case 'divide':
            // 错误处理：确保b不为0
            if (b === 0) {
              return h.response({
                status: 'error',
                message: 'Cannot divide by zero.',
              }).code(400);
            }
            return {
              status: 'success',
              result: a / b,
            };
          default:
            return h.response({
              status: 'error',
              message: 'Unsupported operation.',
            }).code(400);
        }
      } catch (error) {
        // 捕获任何未处理的错误
        return h.response({
          status: 'error',
          message: error.message,
        }).code(500);
      }
    },
    // 添加路由文档
    documentation: {
      tags: ['api'],
      description: 'Performs basic mathematical operations: add, subtract, multiply, divide.',
      parameters: [
        {
          name: 'operation',
          in: 'path',
          type: 'string',
          description: 'The mathematical operation to perform.',
          required: true,
          enum: ['add', 'subtract', 'multiply', 'divide'],
        },
        {
          name: 'a',
          in: 'query',
          type: 'number',
          description: 'The first number.',
          required: true,
        },
        {
          name: 'b',
          in: 'query',
          type: 'number',
          description: 'The second number.',
          required: true,
        },
      ],
    },
  },
};

// 注册路由
server.route(mathRoutes);

// 启动服务器
async function start() {
  try {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();