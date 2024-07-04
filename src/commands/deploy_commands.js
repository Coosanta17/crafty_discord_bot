// This file is responsible for deploying commands to the Discord API. It is run once when the bot starts up, and only deploys
import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { loadCommands } from './commands/command_handler.js';
import deepEqual from 'deep-equal'; 

async function fetchCurrentCommands() { // Fetches the current commands from the Discord API.
    const rest = new REST({ version: '10' }).setToken(config.bot.token);
    try {
        const commands = await rest.get(Routes.applicationCommands(config.bot.clientId));
        return commands;
    } catch (error) {
        console.error('Error fetching current commands:', error);
        return [];
    }
}

(async () => {
    const commands = await loadCommands();
    const rest = new REST({ version: '10' }).setToken(config.bot.token);

    try {
        console.debug('Checking if application (/) commands need updating.');

        const currentCommands = await fetchCurrentCommands();

        // Convert local commands to JSON for comparison
        const localCommandData = [...commands.values()].map(command => command.data.toJSON());

        // Check if the local commands are different from the current commands
        const needsUpdate = !deepEqual(currentCommands, localCommandData);

        if (needsUpdate) {
            console.log('Updating application (/) commands.');

            await rest.put(
                Routes.applicationCommands(config.bot.clientId),
                { body: localCommandData }
            );

            console.log('Successfully updated application (/) commands.');
        }
        console.debug('No update needed.');
    } catch (error) {
        console.error(error);
    }
})();

