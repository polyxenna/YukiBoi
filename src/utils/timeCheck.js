const getFeedingPeriod = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 7 && hour < 11) return "morning";
    if (hour >= 11 && hour < 16) return "afternoon";
    if (hour >= 16 && hour < 20) return "evening";
    return null;
};

module.exports = { getFeedingPeriod };
