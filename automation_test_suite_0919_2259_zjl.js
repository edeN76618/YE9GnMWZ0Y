// 代码生成时间: 2025-09-19 22:59:29
const Hapi = require('@hapi/hapi');
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

// 创建实验室实例
const lab = (exports.lab = Lab.script());

// 创建Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

// 测试套件
lab.experiment('Hapi Server', () => {
    // 在测试开始前执行的代码
    lab.beforeEach(async () => {
        // 启动服务器
        await server.start();
    });

    // 在测试结束后执行的代码
    lab.afterEach(async () => {
        // 停止服务器
        await server.stop();
    });

    // 测试用例
    lab.test('server responds to home page', async () => {
        // 模拟对服务器根路径的GET请求
        const response = await server.inject('/');
        // 断言状态码和返回内容
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.equal('Welcome to Hapi Server!');
    });
});

// 导出Hapi服务器实例
exports.server = server;

// 注册路由
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        // 提供首页响应内容
        return 'Welcome to Hapi Server!';
    },
});