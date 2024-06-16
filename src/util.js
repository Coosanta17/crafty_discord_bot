const intervals = {};

export function dateTimeToMilliseconds(dateTime) {
    const date = new Date(dateTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.getTime();
}

export function minutesToMilliseconds(milliseconds) {
    return milliseconds * 60000;
}

export function startInterval(callback, intervalTime, intervalID) {
    if (isIntervalRunning(intervalID)) {
        console.error(`Interval "${intervalID}" is already running.`);
        return; // Exit early if interval already declared.
    }

    intervals[intervalID] = setInterval(callback, intervalTime);
    console.log(`Interval "${intervalID}" started.`);
}

export function stopInterval(intervalID) {
    if (!intervals[intervalID]) {
        console.error(`Interval "${intervalID}" is not currently running.`);
        return; // Exit early if interval not running.
    }

    clearInterval(intervals[intervalID]);
    delete intervals[intervalID];
    console.log(`Interval "${intervalID}" stopped.`);
}

export function isIntervalRunning(intervalID) {
    return !!intervals[intervalID]; // False if undefined.
}
