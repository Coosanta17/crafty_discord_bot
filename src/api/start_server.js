import axios from "axios";

import { startOptions } from "./client.js";
import { getStats } from "./get_stats.js";
import { startInterval } from "../util.js";

export async function serverStart(message) {
    console.log(`Attempting to start server.`);

    try {
        const statsResponse = await getStats();

        if (statsResponse.running || statsResponse.waitingStart) {
            console.log('Failed - server already online');
            message.reply('The server is already online!');
            return; // Exit early if server online.
        }

        const startResponse = await axios(startOptions); // Call API to start server.

        if (startResponse.data.status !== 'ok') {
            message.reply('Unexpected result - Failed to start server!\n' + JSON.stringify(startResponse.data));
            throw new Error('Failed - Unexpected response:', startResponse.data);
        } 

        console.log('Success!');
        message.reply('Successfully sent request, the server will be starting soon!');

        startInterval(autoStop(), minutesToMilliseconds(2.5), "autoStopInterval");

    } catch (error) {
        console.error('Error making one or both requests:', error.message);
        message.reply('Failed to start server!\n' + error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw error;
    }
}
