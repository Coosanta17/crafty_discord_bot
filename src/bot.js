require('dotenv').config()

const {
    Client,
    IntentsBitField
} = require('discord.js');
const axios = require('axios');
const https = require('https');

const craftyToken = process.env.CRAFTY_TOKEN;
const url = process.env.CRAFTY_SERVER_URL + "api/v2/servers/" + process.env.CRAFTY_SERVER_ID;

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

const startOptions = requestOptions('POST', '/action/start_server');
const statsOptions = requestOptions('GET', '/stats');
const stopOptions = requestOptions('POST', '/action/stop_server');

let dateTime = null;
let checkedLastLogout = false;
let timeSinceLastLogout = dateTime;

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
        // console.log('Getting statistics of server...'); // For debug purposes.

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
                ...(response.data.data.started !== 'False' && {
                    startTime: response.data.data.started
                }),
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
        const currentTime = Date.now();

        if (stats.running) { // none of the following means anything if server offline, so I put the check at the start.
            if (stats.playersOnline <= 0) { // if no player is online
                if (!checkedLastLogout) {
                    timeSinceLastLogout = currentTime;
                    checkedLastLogout = true;

                } else if ( // checks if no players online, server is online and not starting, server has been online for 30 minutes, last logout has been logged, and last player logged out more than 30 minutes ago (-1s to allow for possibly unprecise setInterval)
                    !stats.waitingStart &&
                    (currentTime - dateTimeToMilliseconds(stats.startTime) >= 1799000) &&
                    (currentTime - timeSinceLastLogout >= 1800000)
                ) {
                    console.log("Stopping server due to lack of activity...");
                    const stopResponse = await axios(stopOptions);

                    if (stopResponse.data.status === 'ok') {
                        console.log("Success!");
                        checkedLastLogout = false;
                        timeSinceLastLogout = null;
                    } else {
                        console.log("Failed - Unexpected response:", stopResponse.data);
                    }
                } // else console.log('not stopping!\n online for: ' + Math.floor(Date.now() - dateTimeToMilliseconds(stats.startTime)/1000) + ' seconds\n' + dateTimeToMilliseconds(stats.startTime)/1000 + '\n' + Math.floor(Date.now()/1000)); // For debug purposes
            } else { // If people are online then last logout hasn't happened anymore so must be reset.
                checkedLastLogout = false;
                timeSinceLastLogout = null;
            }
        }

    } catch (error) {
        console.error('Error making one or both requests:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}

async function serverStart(chatMessage) {
    console.log(`Attempting to start server with url ${url}/`);

    const message = chatMessage;

    try {
        const statsResponse = await getStats();
        if (!statsResponse.running && !statsResponse.waitingStart) { // Checks if server offline
            const startResponse = await axios(startOptions);
            if (startResponse.data.status === 'ok') {
                console.log('Success!');
                message.reply('Successfully sent request, the server will be starting soon!');
            } else {
                console.log('Unexpected response:', startResponse.data);
                message.reply('Unexpected result - Failed to start server!\n' + JSON.stringify(startResponse.data));
            }
        } else if (statsResponse.running || statsResponse.waitingStart) { // Runs with fail if server online
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