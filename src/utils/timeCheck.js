const getFeedingPeriod = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 7 && hour < 11) return "morning";
    if (hour >= 11 && hour < 16) return "afternoon";
    if (hour >= 16 && hour < 20) return "evening";
    return null;
};

const getFeedingPeriodFromTime = (timeStr) => {
    // Check if time includes AM/PM
    const hasAMPM = timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm");
    let hours, minutes;

    if (hasAMPM) {
        // Handle 12-hour format (e.g., 9:15 AM or 9:15 PM)
        const [time, period] = timeStr.split(" ");
        [hours, minutes] = time.split(":").map(Number);

        if (period.toLowerCase() === "pm" && hours !== 12) {
            hours += 12;
        }
        if (period.toLowerCase() === "am" && hours === 12) {
            hours = 0;
        }
    } else {
        // Handle 24-hour format (e.g., 21:15)
        [hours, minutes] = timeStr.split(":").map(Number);
    }

    if (hours >= 7 && hours < 11) return "morning";
    if (hours >= 11 && hours < 16) return "afternoon";
    if (hours >= 16 && hours < 20) return "evening";
    return null;
};

module.exports = { getFeedingPeriod, getFeedingPeriodFromTime };
