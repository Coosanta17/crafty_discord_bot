import { discordClient as client } from "./api/client.js";
import { autoStop, serverStart } from "./api/start_server.js";

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
    const autoStopInterval = setInterval(autoStop, 300000); // 5 minutes in milliseconds
});

client.on('messageCreate', async (message) => {
    if (message.content === '>start') {
        await serverStart(message); // not sure how awaiting will impact it...
    }
});


client.login(process.env.DISCORD_TOKEN);