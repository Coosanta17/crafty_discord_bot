import axios from "axios";

import { startOptions } from "./client.js";
import { getStats } from "./get_stats.js";
import { setAutoStopInterval } from "./stop_server.js";
import { log } from "../util.js";

export async function serverStart() {
    log(`Attempting to start server.`);

    try {
        const statsResponse = await getStats();

        if (statsResponse.running || statsResponse.waitingStart) {
            log("Failed - server already online");
            return "The server is already online!"; // Exit early if server online.
        }

        const startResponse = await axios(startOptions); // Call API to start server.

        if (startResponse.data.status !== "ok") {
            console.error("Failed to start server:", startResponse.data);
            return ("Unexpected result - Failed to start server!\n" + JSON.stringify(startResponse.data))
        } 

        log("Success!");

        setAutoStopInterval();

        return "Successfully sent request, the server will be starting soon!";

    } catch (error) {
        console.error("Error making one or both requests:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }
        return ("An unexpected error occurred while starting the server.\n" + JSON.stringify(error.message));
    }
}
