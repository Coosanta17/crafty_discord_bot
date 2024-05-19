require('dotenv').config()

const {
    Client,
    IntentsBitField
} = require('discord.js');
const axios = require('axios');
const https = require('https');

const craftyToken = process.env.CRAFTY_TOKEN;
const url = process.env.CRAFTY_SERVER_URL;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Create an HTTPS agent that allows self-signed certificates
const agent = new https.Agent({
    rejectUnauthorized: false
});

// Configure http request for start server
const startOptions = {
    method: 'POST',
    url: `${url}/action/start_server`,
    headers: {
        'Authorization': `bearer ${craftyToken}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
};

// Configure http request for get stats
const statsOptions = {
    method: 'GET',
    url: `${url}/stats`,
    headers: {
        'Authorization': `bearer ${craftyToken}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
};

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
    /*
    // Message logger that i should probably delete but I like it though
    if (message.author.bot) {
        console.log(`[${message.createdAt}] ${message.author.tag} [Bot]: "${message.content}"`);
        return;
    }
    else console.log(`[${message.createdAt}] ${message.author.tag}: "${message.content}"`);
    */

    if (message.content === '>start') {
        console.log(`Attempting to start server with url ${url}/`);

        try {
            const [startResponse, statsResponse] = await Promise.all([
                axios(startOptions),
                axios(statsOptions)
            ]);

            if (startResponse.data.status === 'ok' && statsResponse.data.data.running === false && statsResponse.data.data.waiting_start === false) {
                console.log('Success!');
                message.reply('Successfully sent request, the server will be starting soon!');
            } else if (startResponse.data.status !== 'ok') {
                console.log('Unexpected response:', startResponse.data);
                message.reply('Unexpected result - Failed to start server!\n' + JSON.stringify(startResponse.data));
            } else if (statsResponse.data.data.running === true || statsResponse.data.data.waiting_start === true) {
                console.log('Failed - server already online');
                message.reply('The server is already online!');
            }
        } catch (error) {
            console.error('Error making one or both requests:', error.message);
            message.reply('Failed to start server!\n' + error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    }
});


client.login(process.env.DISCORD_TOKEN);