import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

export async function loadCommands(client) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const commandsPath = path.join(__dirname, 'commands'); 

    try {
        const commandFiles = await readCommandFiles(commandsPath);

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const { default: commandModule } = await import('file://' + filePath); // Convert filePath to a file:// URL

            if (!commandModule || !('data' in commandModule) || !('execute' in commandModule)) {
                console.log(`[WARNING] The command module at ${filePath} does not export required properties.`);
                continue;
            }

            client.commands.set(commandModule.data.name, commandModule);
        }
    } catch (error) {
        console.error('Error loading commands:', error);
        throw error; // Rethrow the error to handle it higher up if needed. May result in double logging.
    }
}

async function readCommandFiles(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            const nestedFiles = await readCommandFiles(fullPath); // Recursively read nested directories
            files = files.concat(nestedFiles);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            files.push(entry.name);
        }
    }

    return files;
}