import { checkConfigFile, config } from "./config.js";
await checkConfigFile();
// Import and run checkConfigFile() before all other imports to set config variable.
// If this isn't done, it will crash when creating config file for the first time.

const { discordClient } = await import("./api/client.js");
const { serverStart } = await import("./api/start_server.js");
const { getStats } = await import("./api/get_stats.js");
const { setAutoStopInterval } = await import("./api/stop_server.js");
const { isIntervalRunning } =  await import("./util.js");
const start = await import("./commands/start.js");
const { ActivityType, Collection, Events } = await import("discord.js");
const { loadCommands } = await import("./load_commands.js");

let stats = await getStats(); // Tests if the api connection is working (+ other uses)

discordClient.commands = new Collection();
await loadCommands(discordClient);

if (stats.running && !isIntervalRunning("autoStopInterval")) {
    setAutoStopInterval();
    console.debug("Restored existing or missing interval.");
}

discordClient.on('ready', (c) => {
    c.application.commands.create(start);
    c.user.setActivity("servers", { type: ActivityType.Watching })
    console.log(`${c.user.tag} is online!`);
});

discordClient.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.commands.text.prefix)) {
        return;
    }

    if (config.commands.text.enabled && message.content.substring(1).toLowerCase() === "start") {
        message.reply(serverStart());
    } else {
        message.reply("Unknown command.");
    }
});


discordClient.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) {
        return;
    }

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

discordClient.login(config.bot.token);