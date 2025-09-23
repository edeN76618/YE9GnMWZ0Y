// 代码生成时间: 2025-09-24 01:00:41
const Hapi = require('@hapi/hapi');
const Fs = require('fs');
const Path = require('path');

// Define the plugin name
const pluginName = 'folderStructureOrganizer';

// Define the method to organize the folder structure
const organizeFolderStructure = async (server, options) => {
  const { directoryPath } = options;

  // Check if the directory exists
  const directoryExists = await Fs.promises.access(directoryPath).then(
    () => true,
    () => false
  );

  if (!directoryExists) {
    throw new Error(`Directory ${directoryPath} does not exist.`);
  }

  // Define the structure of the folder
  const folderStructure = {
    'images': 'Images folder',
    'documents': 'Documents folder',
    'videos': 'Videos folder'
  };

  // Create folders based on the structure
  await Promise.all(
    Object.keys(folderStructure).map(async (folderName) => {
      const folderPath = Path.join(directoryPath, folderName);
      try {
        // Check if the folder already exists
        await Fs.promises.access(folderPath);
      } catch (error) {
        // If not, create the folder
        await Fs.promises.mkdir(folderPath);
        server.log(['folderStructureOrganizer', 'info'], `Created folder: ${folderName}`);
      }
    })
  );
};

// Define the HAPI plugin registration function
exports.plugin = {
  name: pluginName,
  async register(server, options) {
    // Register the organizeFolderStructure method as a server method
    server.method('organizeFolderStructure', organizeFolderStructure, {
      cache: { expiresIn: 60 * 60 * 1000 }, // Cache for 1 hour
      bind: server,
      once: true, // Ensure the method is only executed once
    });

    // Define a route to trigger the folder structure organization
    server.route({
      method: 'POST',
      path: '/organize',
      handler: async (request, h) => {
        try {
          // Call the organizeFolderStructure method
          await request.server.methods.organizeFolderStructure(request.payload);
          return h.response('Folder structure organized successfully.').code(200);
        } catch (error) {
          return h.response(error.message).code(500);
        }
      },
    });
  },
};

// Usage:
// 1. Register the plugin with HAPI server
// 2. Send a POST request to '/organize' with the directory path in the payload
