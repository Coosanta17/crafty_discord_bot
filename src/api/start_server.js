import axios from "axios";

import { startOptions } from "./client.js";
import { getStats } from "./get_stats.js";

export async function serverStart(chatMessage) {
    console.log(`Attempting to start server.`);
    const message = chatMessage;

    try {
        const statsResponse = await getStats();

        if (statsResponse.running || statsResponse.waitingStart) {
            console.log('Failed - server already online');
            message.reply('The server is already online!');
            return;
        }

        const startResponse = await axios(startOptions); // Call API to start server

        if (startResponse.data.status !== 'ok') {
            console.log('Failed - Unexpected response:', startResponse.data);
            message.reply('Unexpected result - Failed to start server!\n' + JSON.stringify(startResponse.data));
            return;
        } 

        console.log('Success!');
        message.reply('Successfully sent request, the server will be starting soon!');

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
