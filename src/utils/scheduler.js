const cron = require("node-cron");
const { scheduleReminders } = require("./messages");

class EventScheduler {
    constructor(client) {
        this.schedules = new Map();
        this.client = client;
    }

    addEvent(event, date) {
        const eventDate = new Date(date);
        const dayBefore = new Date(eventDate);
        dayBefore.setDate(dayBefore.getDate() - 1);

        // Schedule day before reminder
        this.scheduleReminder(event, dayBefore, "dayBefore");

        // Schedule 3-hour reminder
        const threeHoursBefore = new Date(eventDate);
        threeHoursBefore.setHours(eventDate.getHours() - 3);
        this.scheduleReminder(event, threeHoursBefore, "threeHours");

        // Schedule 1-hour reminder
        const oneHourBefore = new Date(eventDate);
        oneHourBefore.setHours(eventDate.getHours() - 1);
        this.scheduleReminder(event, oneHourBefore, "oneHour");

        return true;
    }

    scheduleReminder(event, date, type) {
        const minute = date.getMinutes();
        const hour = date.getHours();
        const dayOfMonth = date.getDate();
        const month = date.getMonth() + 1;

        const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;
        const reminder = scheduleReminders[type].map((msg) => msg.replace("{event}", event))[0];

        cron.schedule(cronExpression, () => {
            const channel = this.client.channels.cache.get(process.env.CHANNEL_ID);
            if (channel) {
                channel.send(reminder);
            }
        });

        return cronExpression;
    }
}

module.exports = EventScheduler;
