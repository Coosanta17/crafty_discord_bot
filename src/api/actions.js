import axios from "axios";

import { startOptions, stopOptions, url } from "./client.js";
import { getStats } from "./get_stats.js";
import { dateTimeToMilliseconds } from "../util.js";

let checkedLastLogout = false;
let timeSinceLastLogout = null;

export async function serverStart(chatMessage) {
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

export async function autoStop() {
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
