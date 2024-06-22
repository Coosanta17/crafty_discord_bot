import axios from "axios";

import { stopOptions } from "./client.js";
import { getStats } from "./get_stats.js";
import { dateTimeToMilliseconds, minutesToMilliseconds, startInterval, stopInterval } from "../util.js";

const THIRTY_MINUTES = minutesToMilliseconds(30);
const stats = await getStats();

let checkedLastLogout = false;
let timeSinceLastLogout = null;

export function setAutoStopInterval() {
    startInterval(autoStop, minutesToMilliseconds(2.5), "autoStopInterval");
}

export async function autoStop() {
    try {

        if (!stats.running) {
            return; // Exit early if the server is not running.
        }

        if (stats.playersOnline > 0) {
            checkedLastLogout = false;
            timeSinceLastLogout = null;
            return; // Reset last logout tracking and exit early if players are online.
        }

        // The following only runs if the server is online, and there are no players online.
        const currentTime = Date.now();

        if (!checkedLastLogout) {
            timeSinceLastLogout = currentTime;
            checkedLastLogout = true;
        }

        const serverRunningTime = currentTime - dateTimeToMilliseconds(stats.startTime);
        const timeSinceLastLogoutElapsed = currentTime - timeSinceLastLogout;

        if (stats.waitingStart || serverRunningTime < THIRTY_MINUTES || timeSinceLastLogoutElapsed < THIRTY_MINUTES) {
            return;
        }

        console.log("Stopping server due to lack of activity...");

        const stopResponse = await axios(stopOptions); // Call API to stop server.

        if (stopResponse.data.status !== 'ok') {
            console.log("Failed - Unexpected response:", stopResponse.data);
            return;
        }

        console.log("Success!");

        stopInterval("autoStopInterval");
        
        checkedLastLogout = false;
        timeSinceLastLogout = null;

    } catch (error) {
        console.error('Error making one or both requests:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}
