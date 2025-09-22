// 代码生成时间: 2025-09-23 01:23:44
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

// 配置文件管理器类
class ConfigManager {

    // 构造函数
    constructor(server) {
        this.server = server;
    }

    // 加载配置文件
    async loadConfig(filePath) {
        try {
            const configData = await fs.promises.readFile(filePath, 'utf8');
            const configObject = JSON.parse(configData);
            return configObject;
        } catch (error) {
            throw new Error(`Failed to load config file: ${error.message}`);
        }
    }

    // 校验配置文件
    validateConfig(config, schema) {
        const { error } = Joi.validate(config, schema);
        if (error) {
            throw new Error(`Validation error: ${error.message}`);
        }
        return config;
    }
}

// Hapi 服务器配置
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 注册配置管理器插件
    await server.register({
        plugin: ConfigManager,
        options: { server }
    });

    // 路由配置
    server.route({
        method: 'GET',
        path: '/config',
        handler: async (request, h) => {
            try {
                const configManager = request.server.plugins.configManager;
                const configFilePath = path.join(__dirname, 'config.json');
                const config = await configManager.loadConfig(configFilePath);
                const configSchema = Joi.object({
                    key: Joi.string().required(),
                    value: Joi.any().required()
                });
                const validatedConfig = configManager.validateConfig(config, configSchema);
                return { status: 'success', config: validatedConfig };
            } catch (error) {
                return {
                    status: 'error',
                    message: error.message
                };
            }
        }
    });

    // 启动服务器
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 运行服务器
init();