import path from 'path';
import fs from 'fs';

export async function loadCommands(client) {
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(filePath);

            if (!('data' in command && 'execute' in command)) { // Prevent unfinished commands from being executed.
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                continue;
            }

            client.commands.set(command.data.name, command);
        }
    }
}
