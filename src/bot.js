import { discordClient as client } from "./api/client.js";
import { serverStart } from "./api/start_server.js";

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '>start') {
        await serverStart(message);
    }
});


client.login(process.env.DISCORD_TOKEN);