// This isn't the configuration file! Check for config.json in the root directory.

import fs from 'fs';

const configPath = "./config.json";
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

async function createJsonFile(filePath, content) {
    console.log("Creating configuration file...");
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4), "utf-8");
        console.log("Created config file.")
    } catch (error) {
        throw new Error('Error creating config file', error);
    }
}

export async function checkConfigFile() {
    try {
        if (!fs.existsSync(configPath)) {
            createJsonFile(configPath, defaultConfig);
        }
        return JSON.parse(fs.readFileSync(configPath, "utf-8")); // Syncronous because everything wont work without it.

    } catch (error) {
        console.error('Error checking config file:', error);
    }
}
