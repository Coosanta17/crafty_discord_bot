const dateTime = getCurrentDateTime();

function dateTimeToSeconds(dateTime) {
	const date = new Date(dateTime);
  
	// Check if the date is valid
	if (isNaN(date.getTime())) {
	  throw new Error('Invalid date format');
	}
  
	// Convert the date to seconds
	const seconds = Math.floor(date.getTime() / 1000);
  
	return seconds;
}


// Converts current time into "YYYY-MM-DD HH:MM:SS" format.
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
console.log("turning dateTime: " + dateTime + " into seconds: " + dateTimeToSeconds(dateTime));