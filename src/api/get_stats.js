import { statsOptions } from "./client.js";
import axios from "axios";

export async function getStats() {
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
