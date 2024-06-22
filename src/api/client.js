import { Agent as HttpsAgent } from 'https';
import { Client, IntentsBitField } from 'discord.js';

import { config } from '../config.js';
import { addCharacterAtEndOfStringIfMissing } from '../util.js';

export const discordClient = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const craftyToken = config.crafty.api_token;
export const url = addCharacterAtEndOfStringIfMissing(config.crafty.url, "/") + "api/v2/servers/" + config.crafty.server_id;

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