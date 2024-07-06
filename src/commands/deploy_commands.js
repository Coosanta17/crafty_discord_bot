import { REST, Routes } from "discord.js";
import { config } from "../config.js";
import { getCommands } from "./command_handler.js";

const rest = new REST({ version: "10" }).setToken(config.bot.token);

async function fetchApplicationInfo() {
    try {
        const appInfo = await rest.get(Routes.oauth2CurrentApplication());
        return appInfo;
    } catch (error) {
        console.error("Error fetching application info:", error);
        throw error;
    }
}

async function fetchCurrentCommands(clientId) {
    try {
        const commands = await rest.get(Routes.applicationCommands(clientId));
        return commands;
    } catch (error) {
        console.error("Error fetching current commands:", error);
        return [];
    }
}

function compareCommandArrays(arr1, arr2) { 
    // Returns true only if the two arrays are equal in length and have matching name and description in each object in the array, false otherwise.
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Convert arr2 to a map for easier comparison.
    const map = new Map();
    arr2.forEach(item => {
        map.set(item.name, item.description);
    });

    // Iterate over arr1 and check if the corresponding name and description match in arr2.
    for (const item of arr1) {
        const description = map.get(item.name);
        if (description !== item.description) {
            return false;
        }
    }
    return true;
}

(async () => {
    try {
        console.debug("Fetching application info...");
        const appInfo = await fetchApplicationInfo();
        const clientId = appInfo.id;

        console.debug("Checking if application (/) commands need updating...");
        const commands = await getCommands();
        const currentCommands = await fetchCurrentCommands(clientId);

        // Convert local commands to JSON for comparison
        const localCommandData = [...commands.values()].map(command => command.data.toJSON());

        // Check if the local commands are different from the current commands
        const needsUpdate = !compareCommandArrays(localCommandData, currentCommands);

        if (needsUpdate) {
            console.log("Updating application (/) commands...");
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: localCommandData }
            );
            console.log("Successfully updated application (/) commands.");
        } else {
            console.debug("No update needed.");
        }
    } catch (error) {
        console.error(error);
    }
})();
