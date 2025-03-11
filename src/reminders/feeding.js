const cron = require("node-cron");
const { FEEDING_TIMES, calculateCronTime } = require("../config/constants");
const { feedingReminders } = require("../utils/messages");

function setupFeedingReminders(client, feedingStatus) {
    Object.entries(FEEDING_TIMES).forEach(([period, time]) => {
        // 5 minute warning
        const reminderTime = calculateCronTime(time.hour, time.minute, -5);
        cron.schedule(`${reminderTime.minute} ${reminderTime.hour} * * *`, () => {
            const channel = client.channels.cache.get(process.env.CHANNEL_ID);
            const randomReminder =
                feedingReminders[Math.floor(Math.random() * feedingReminders.length)];
            channel.send(randomReminder);
        });

        // Follow-up reminders
        [5, 10, 15].forEach((minutes) => {
            const followupTime = calculateCronTime(time.hour, time.minute, minutes);
            cron.schedule(`${followupTime.minute} ${followupTime.hour} * * *`, () => {
                const channel = client.channels.cache.get(process.env.CHANNEL_ID);
                if (!feedingStatus[period]) {
                    channel.send(
                        `⚠️ Reminder: Yuki hasn't been fed yet! It's been ${minutes} minutes since feeding time! 🐕`,
                    );
                }
            });
        });
    });
}

module.exports = { setupFeedingReminders };
