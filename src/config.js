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
        token: "CRAFTY_TOKEN",
        server_id: "7010d5b8-cb49-4334-9d99-6f0ef860a672",
    },
    commands: {
        slash: {
            enabled: true,
            trigger: "start"
        },
        text: {
            enabled: false,
            trigger: ">start"
        }
    }
};

async function updateConfig(filePath, updatedConfig) {
    const existingConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return mergeObjects(existingConfig, updatedConfig);
}

export async function checkConfigFile() {
    try {
        if (!fs.existsSync(configPath)) {
            console.log("No config file found, generating in working directory.")
            await createJsonFile(configPath, defaultConfig);
            console.log("Config file can be found at ./config.json\nPlease add Bot token, Crafty token and server URL to config file before restarting the bot.");
            shutDown();
        }

        let configFromFile = await parseJsonFile(configPath);

        if (!compareObjects(configFromFile, defaultConfig)){
            console.log("Outdated config.json detected - updating...");
            configFromFile = await updateConfig(configPath, defaultConfig)
        }

        return configFromFile;

    } catch (error) {
        console.error("Error checking config file:", error);
    }
}
