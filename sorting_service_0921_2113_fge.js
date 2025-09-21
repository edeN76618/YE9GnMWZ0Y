// 代码生成时间: 2025-09-21 21:13:51
const Hapi = require('@hapi/hapi');

// 定义排序服务
class SortingService {
    // 冒泡排序算法
    bubbleSort(arr) {
        if (!Array.isArray(arr)) {
            throw new Error('Input must be an array');
        }
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 交换元素
                }
            }
        }
        return arr;
    }

    // 快速排序算法
    quickSort(arr) {
        if (!Array.isArray(arr) || arr.length <= 1) {
            return arr;
        }
        let pivot = arr[arr.length - 1];
        let left = [];
        let right = [];
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right));
    }
}

// 创建Hapi服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义一个路由，用于执行排序算法
    server.route({
        method: 'GET',
        path: '/sort',
        handler: async (request, h) => {
            try {
                let { algorithm, numbers } = request.query;
                let sortingService = new SortingService();

                // 校验输入
                if (!numbers || !algorithm) {
                    return h.response({
                        status: 'error',
                        message: 'Please provide algorithm and numbers'
                    }).code(400);
                }
                if (!Array.isArray(JSON.parse(numbers))) {
                    return h.response({
                        status: 'error',
                        message: 'Numbers must be an array'
                    }).code(400);
                }

                // 根据算法执行排序
                let sortedNumbers;
                switch (algorithm) {
                    case 'bubble':
                        sortedNumbers = sortingService.bubbleSort(JSON.parse(numbers));
                        break;
                    case 'quick':
                        sortedNumbers = sortingService.quickSort(JSON.parse(numbers));
                        break;
                    default:
                        return h.response({
                            status: 'error',
                            message: 'Invalid sorting algorithm'
                        }).code(400);
                }

                // 返回排序结果
                return {
                    status: 'success',
                    sortedNumbers: sortedNumbers
                };
            } catch (error) {
                // 错误处理
                return h.response({
                    status: 'error',
                    message: error.message
                }).code(500);
            }
        }
    });

    // 启动服务器
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 初始化服务器
init();