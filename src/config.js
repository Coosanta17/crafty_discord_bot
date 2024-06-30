// This isn't the configuration file! Check for config.json in the root directory.

import fs from 'fs';
import path from 'path';

import { compareObjects, createJsonFile, mergeObjects, parseJsonFile, shutDown } from './util.js';

const configPath = path.resolve(process.cwd(), 'config.json');
const defaultConfig = {
    bot: {
        token: "BOT_TOKEN",
    },
    crafty: {
        api_token: "CRAFTY_TOKEN",
        server_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        url: "https://localhost:8000/"
    },
    commands: {
        slash: {
            enabled: false,
        },
        text: {
            enabled: false,
            prefix: "!"
        }
    }
};

let configFromFile;
export { configFromFile as config };

async function updateConfig(filePath, updatedConfig) {
    const existingConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return mergeObjects(existingConfig, updatedConfig);
}

export async function checkConfigFile() {
    try {
        if (configFromFile) {
            console.debug("Config already checked.");
            return configFromFile;
        }

        if (!fs.existsSync(configPath)) {
            console.log("No config file found, generating in working directory.")
            await createJsonFile(configPath, defaultConfig);
            console.log("Config file can be found at ./config.json\nPlease add Bot token, Crafty token and server URL to config file before restarting the bot.");
            shutDown();
        }

        configFromFile = await parseJsonFile(configPath);

        if (!compareObjects(configFromFile, defaultConfig)){
            console.log("Outdated config.json detected - updating...");
            const updatedConfig = await updateConfig(configPath, defaultConfig);
            await createJsonFile(configPath, updatedConfig); // Overwrites existing file.
            configFromFile = updatedConfig;
        }

        return configFromFile;

    } catch (error) {
        console.error("Error checking config file:", error);
    }
}
