// 代码生成时间: 2025-09-21 07:20:50
 * This API provides an endpoint to generate Excel files dynamically.
 */

const Hapi = require('@hapi/hapi');
const ExcelJS = require('exceljs');
const fs = require('fs');

// Initialize Hapi server on port 3000
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Create a route for generating Excel files
server.route({
    method: 'GET',
    path: '/generate-excel',
    options: {
        // Enable CORS for testing purposes
        cors: {
            origin: ['*']
        },
        handler: async (request, h) => {
            try {
                // Create a new Excel workbook
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('GeneratedData');

                // Add sample data to the worksheet
                worksheet.addRow({
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com'
                });
                worksheet.addRow({
                    id: 2,
                    name: 'Jane Doe',
                    email: 'jane@example.com'
                });

                // Add more data or generate dynamically based on query parameters or payload

                // Write the workbook to a buffer
                const buffer = await workbook.xlsx.writeBuffer();

                // Return the buffer as a response with appropriate headers
                return h.response(buffer).type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            } catch (error) {
                // Handle any errors that occur during Excel generation
                return h.response(error.message).code(500);
            }
        }
    }
});

// Start the server
async function start() {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();
