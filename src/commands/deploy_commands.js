import { REST, Routes } from 'discord.js';
import { config } from '../config.js';
import { loadCommands } from './load_commands.js';

(async () => {
    const commands = await loadCommands();
    const rest = new REST({ version: '10' }).setToken(config.bot.token);

    try {
        console.log('Started refreshing application (/) commands.');

        // Register all commands globally
        const commandData = [...commands.values()].map(command => command.data.toJSON());
        await rest.put(
            Routes.applicationCommands(config.bot.clientId),
            { body: commandData }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
