const dateTime = getCurrentDateTime();

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
