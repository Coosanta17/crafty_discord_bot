import { Agent as HttpsAgent } from 'https';
import { Client, IntentsBitField } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

export const discordClient = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const craftyToken = process.env.CRAFTY_TOKEN;
export const url = process.env.CRAFTY_SERVER_URL + "api/v2/servers/" + process.env.CRAFTY_SERVER_ID;

// Create an HTTPS agent that allows self-signed certificates
const agent = new HttpsAgent({
    rejectUnauthorized: false
});

// Configure HTTP requests
const requestOptions = (method, endpoint) => ({
    method,
    url: `${url}${endpoint}`,
    headers: {
        'Authorization': `bearer ${craftyToken}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
});

export const startOptions = requestOptions('POST', '/action/start_server');
export const statsOptions = requestOptions('GET', '/stats');
export const stopOptions = requestOptions('POST', '/action/stop_server');