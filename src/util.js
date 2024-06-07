const dateTime = getCurrentDateTime();

export function dateTimeToMilliseconds(dateTime) {
    const date = new Date(dateTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.getTime();
}

// Converts current time into "YYYY-MM-DD HH:MM:SS" format. (unused)
function getCurrentDateTime() {
    const now = new Date();
  
    // Date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(now.getDate()).padStart(2, '0');
  
    // Time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Format the date and time as "YYYY-MM-DD HH:MM:SS"
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDateTime;
  }

//let dateSeconds = await dateTimeToSeconds(dateTime);
//console.log("turning dateTime: " + dateTime + " into seconds: " + dateTimeToSeconds(dateTime));