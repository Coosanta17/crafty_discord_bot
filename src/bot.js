import { checkConfigFile, config } from "./config.js";
await checkConfigFile();
// Import and run checkConfigFile() before all other imports to set config variable.

const { discordClient } = await import("./api/client.js");
const { serverStart } = await import("./api/start_server.js");
const { getStats } = await import("./api/get_stats.js");
const { setAutoStopInterval } = await import("./api/stop_server.js");
const { isIntervalRunning } =  await import("./util.js");

let stats = await getStats(); // Tests if the api connection is working (+ other uses)

if (stats.running && !isIntervalRunning("autoStopInterval")) {
    setAutoStopInterval();
    console.debug("Restored existing or missing interval.");
}

discordClient.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

discordClient.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.commands.text.prefix)) {
        return;
    }

    if (config.commands.text.enabled && message.content.substring(1).toLowerCase() === "start") {
        await serverStart(message);
        //message.reply("I'm working!"); // debug
    } else {
        message.reply("Unknown command.");
    }
});


discordClient.login(config.bot.token);