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
// how to get rid of boilerplate code?? impossible i think...
const statsOptions = {
    method: 'GET',
    url: `${url}/stats`,
    headers: {
        'Authorization': `bearer ${craftyToken}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
};

// Configure http request for stop server
const stopOptions = {
    method: 'POST',
    url: `${url}/action/stop_server`,
    headers: {
        'Authorization': `bearer ${craftyToken}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
};

let dateTime = Date.now();

function dateTimeToMilliseconds(dateTime) {
    const date = new Date(dateTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.getTime();
}


async function getStats() {
    try {
        const response = await axios(statsOptions);
		// console.log('Getting statistics of server...'); // Only use in development

        if (response.data.status === 'ok') {
            return {
                status: response.data.status,
                waitingStart: response.data.data.waiting_start,
                running: response.data.data.running,
                memoryUsage: response.data.data.mem,
                cpuUsage: response.data.data.cpu,
                playersOnline: response.data.data.online,
                maxPlayers: response.data.data.max,
                // response,
				...(response.data.data.started !== 'False' && { startTime: response.data.data.started }),
            };
        } else {
            throw new Error('Unexpected response status from method getStats(): ' + response.data.status);
        }
    } catch (error) {
        console.error('Error getting stats:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw error;
    }
}

async function autoStop() {
    try {
        const stats = await getStats();

		// checks if no players online, server is online and not starting, and server has been online for 30 minutes (+10ms to allow for possibly unprecise setInterval)
        if (stats.playersOnline <= 0 && stats.running === true && stats.waitingStart === false && (Date.now() - dateTimeToMilliseconds(stats.startTime)) >= 1800010) {
            console.log("Stopping server due to lack of activity...");

            const stopResponse = await axios(stopOptions);

            if (stopResponse.data.status === 'ok') {
                console.log("Success!");
            } else {
                console.log("Failed - Unexpected response:", stopResponse.data);
            }
        } // else console.log('not stopping!\n online for: ' + Math.floor(Date.now() - dateTimeToMilliseconds(stats.startTime)/1000) + ' seconds\n' + dateTimeToMilliseconds(stats.startTime)/1000 + '\n' + Math.floor(Date.now()/1000)); // Only use in development

    } catch (error) {
        console.error('Error making one or both requests:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
    const autoStopInterval = setInterval(autoStop, 1800000);
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
            const statsResponse = await getStats();
            if (statsResponse.running === false && statsResponse.waitingStart === false) { // Checks if server offline
                const startResponse = await axios(startOptions);
                if (startResponse.data.status === 'ok') {
                    console.log('Success!');
                    message.reply('Successfully sent request, the server will be starting soon!');
                } else if (startResponse.status !== 'ok') {
                    console.log('Unexpected response:', startResponse.data);
                    message.reply('Unexpected result - Failed to start server!\n' + JSON.stringify(startResponse.data));
                }
            } else if (statsResponse.running === true || statsResponse.waitingStart === true) { // Runs with fail if server online
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