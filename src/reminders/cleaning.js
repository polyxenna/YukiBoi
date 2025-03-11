const cron = require("node-cron");
const { CLEANING_TIME, calculateCronTime } = require("../config/constants");
const { cleaningReminders } = require("../utils/messages");

function setupCleaningReminders(client) {
    const reminderTime = calculateCronTime(CLEANING_TIME.hour, CLEANING_TIME.minute, -5);
    cron.schedule(`${reminderTime.minute} ${reminderTime.hour} * * *`, () => {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        const randomReminder =
            cleaningReminders[Math.floor(Math.random() * cleaningReminders.length)];
        channel.send(randomReminder);
    });
}

module.exports = { setupCleaningReminders };
