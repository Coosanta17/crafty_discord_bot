import { checkConfigFile, config } from "./config.js";
await checkConfigFile();
// Import and run checkConfigFile() before all other imports to set config variable.

const { discordClient } = await import("./api/client.js");
const { serverStart } = await import("./api/start_server.js");
const { getStats } = await import("./api/get_stats.js");

getStats(); // Test API ping

discordClient.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

discordClient.on('messageCreate', async (message) => {
    // text command
    if (config.commands.text.enabled && message.content === config.commands.text.trigger) {
        await serverStart(message);
    }
});


discordClient.login(config.bot.token);