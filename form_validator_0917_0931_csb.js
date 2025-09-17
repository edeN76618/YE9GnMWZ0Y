// 代码生成时间: 2025-09-17 09:31:22
const Joi = require('@hapi/joi');

// 创建一个Hapi服务器
const server = require('hapi').server({
    port: 3000,
    host: 'localhost'
});

// 表单数据验证器
const validateFormData = async (request, h) => {
    try {
        // 定义表单验证模式
        const schema = Joi.object({
            username: Joi.string().required().min(3),
            password: Joi.string().required().min(8),
            email: Joi.string().email().required()
        });

        // 验证请求体中的数据
        const { value, error } = schema.validate(request.payload);

        // 如果验证失败，返回错误信息
        if (error) {
            return h.response({
                message: 'Invalid input data',
                errors: error.details.map(e => e.message)
            }).code(400);
        }

        // 如果验证成功，返回验证后的数据
        return h.response({
            data: value,
            message: 'Data successfully validated'
        }).code(200);
    } catch (error) {
        // 处理任何意外的异常
        return h.response({
            message: 'An error occurred while validating the data',
            error: error.message
        }).code(500);
    }
};

// 路由定义
server.route([
    {
        method: 'POST',
        path: '/validate',
        handler: async (request, h) => {
            // 调用验证器并返回结果
            return validateFormData(request, h);
        },
        config: {
            validate: {
                payload: {
                    allow: 'application/json', // 只允许JSON格式的请求体
                    failAction: validateFormData, // 设置自定义验证失败处理程序
                    output: 'data', // 将验证后的数据放在请求体的data属性中
                },
            },
        },
    },
]);

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();