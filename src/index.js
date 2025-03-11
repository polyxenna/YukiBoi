const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { setupFeedingReminders } = require("./reminders/feeding");
const { setupCleaningReminders } = require("./reminders/cleaning");
const { handleFedCommand } = require("./commands/fed");
const { handleCleanedCommand } = require("./commands/cleaned");
const { helpMessage, historyResponses, getRandomResponse } = require("./utils/messages");
const { getFeedingPeriod } = require("./utils/timeCheck");
const EventScheduler = require("./utils/scheduler");
const { getUpcomingSchedules } = require("./config/constants");
const { scheduleViewResponses } = require("./utils/messages");



dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
    ],
});

let scheduler;

let feedingStatus = {
    morning: false,
    afternoon: false,
    evening: false,
    cleaned: false,
};

let feedingHistory = [];

// Reset status and history daily
cron.schedule("0 0 * * *", () => {
    feedingStatus = {
        morning: false,
        afternoon: false,
        evening: false,
        cleaned: false,
    };
    feedingHistory = [];
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "feed") {
        const period = getFeedingPeriod();
        if (period) {
            feedingStatus[period] = true;
            feedingHistory.push({
                period: period,
                time: new Date(),
                fedBy: message.author.username,
            });
            handleFedCommand(message, feedingStatus);
        }
    }

    if (message.content.toLowerCase() === "clean") {
        feedingStatus.cleaned = true;
        handleCleanedCommand(message, feedingStatus);
    }

    if (message.content.toLowerCase() === "history") {
        const randomHeader = getRandomResponse(historyResponses);
        let historyMsg = `${randomHeader}\n\n`;

        if (feedingHistory.length === 0) {
            historyMsg += "🐕 Woof... I haven't been fed yet today!";
        } else {
            feedingHistory.forEach((record) => {
                const time = record.time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                historyMsg += `🕒 ${record.period} meal at ${time} by ${record.fedBy}\n`;
            });
        }

        message.channel.send(historyMsg);
    }

if (message.content.toLowerCase() === "help") {
    const helpEmbed = new EmbedBuilder()
        .setColor("#FFB6C1") // Pink color for Yuki
        .setTitle("🐕 Yuki's Care Commands")
        .setDescription("*Woof! Here are all the ways you can help take care of me!*\n")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
                name: "🍽️ Feeding Commands",
                value: "`feed` - Mark my meal as given\n`history` - See my feeding record for today",
                inline: false,
            },
            {
                name: "\n🧹 Cleaning Commands",
                value: "`clean` - Mark my area as cleaned",
                inline: false,
            },
            {
                name: "\n📅 Schedule Commands",
                value: "`schedule` - View all my upcoming events\n`sched [event] [MM/DD/YYYY] [HH:MM AM/PM]` - Schedule an event\nExample: `sched Vet Visit 12/25/2023 02:30 PM`\n`remove [event]` - Remove a scheduled event",
                inline: false,
            },
            {
                name: "\n📚 Other Commands",
                value: "`invite` - Invite me to your server!",
                inline: false,
            },
        )
        .setFooter({
            text: "YukiBoi 🐶",
            iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

    message.channel.send({ embeds: [helpEmbed] });
    return;
}

    if (message.content.toLowerCase().startsWith("sched ")) {
        const input = message.content.slice(6).trim();

        // Match pattern: event name, date (MM/DD/YYYY), time (HH:MM AM/PM)
        const regex = /(.+) (\d{2}\/\d{2}\/\d{4}) (\d{1,2}:\d{2} [APM]{2})/;
        const match = input.match(regex);

        if (!match) {
            message.reply(
                "❌ Oops! Please use the format: sched Event Name MM/DD/YYYY HH:MM AM/PM\n" +
                    "Example: sched Vet Visit 12/25/2023 02:30 PM",
            );
            return;
        }

        try {
            const [, event, dateStr, timeStr] = match;
            const dateTimeStr = `${dateStr} ${timeStr}`;
            const eventDate = new Date(dateTimeStr);

            if (isNaN(eventDate.getTime())) {
                throw new Error("Invalid date/time");
            }

            const { addSchedule } = require("./config/constants");
            addSchedule(event, eventDate);
            scheduler.addEvent(event, eventDate);

            const formattedTime = eventDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const formattedDate = eventDate.toLocaleDateString("en-US");

            message.reply(
                `🗓️ Got it! I'll remind everyone about my ${event} on ${formattedDate} at ${formattedTime}`,
            );
        } catch (error) {
            message.reply(
                "❌ Oops! Please use the format: sched Event Name MM/DD/YYYY HH:MM AM/PM\n" +
                    "Example: sched Vet Visit 12/25/2023 02:30 PM",
            );
        }
    }

    if (message.content.toLowerCase() === "schedule") {
        const schedules = getUpcomingSchedules();
        const header = getRandomResponse(scheduleViewResponses);

        if (schedules.length === 0) {
            message.channel.send(`${header}\n\n*No upcoming events scheduled!*`);
            return;
        }

        let scheduleMsg = `${header}\n\n`;
        schedules.forEach((schedule) => {
            scheduleMsg += `🔸 **${schedule.event}**\n`;
            scheduleMsg += `   📅 Date: ${schedule.date}\n`;
            scheduleMsg += `   ⏰ Time: ${schedule.time}\n`;
            scheduleMsg += `   ⌛ In: ${schedule.timeUntil}\n\n`;
        });

        message.channel.send(scheduleMsg);
    }

    if (message.content.toLowerCase() === "invite") {
        const inviteEmbed = new EmbedBuilder()
            .setColor("#FFB6C1")
            .setTitle("🐕 Invite Yuki to Your Server!")
            .setDescription(
                `[Click here to invite me!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274878221376&scope=bot)`,
            )
            .setFooter({
                text: "Woof! I can't wait to meet new friends!",
                iconURL: client.user.displayAvatarURL(),
            });

        message.channel.send({ embeds: [inviteEmbed] });
    }

    if (message.content.toLowerCase().startsWith("remove ")) {
        const eventName = message.content.slice(7).trim();

        if (!eventName) {
            message.reply("❌ Please specify an event to remove!\nExample: remove Vet Visit");
            return;
        }

        const { removeSchedule } = require("./config/constants");
        const { scheduleRemovalResponses, getRandomResponse } = require("./utils/messages");

        const removed = removeSchedule(eventName);

        if (removed) {
            const successResponse = getRandomResponse(scheduleRemovalResponses.success);
            message.reply(successResponse);
        } else {
            const notFoundResponse = getRandomResponse(scheduleRemovalResponses.notFound);
            message.reply(notFoundResponse);
        }
    }
});

client.once("ready", () => {
    console.log("Yuki Care Bot is online! 🐕");
    scheduler = new EventScheduler(client);
    setupFeedingReminders(client, feedingStatus);
    setupCleaningReminders(client);
});

client.on("guildCreate", async (guild) => {
    // Try to get the system channel first (default welcome messages)
    let channel = guild.systemChannel;

    // If no system channel, try to find #general
    if (!channel) {
        channel = guild.channels.cache.find(
            (ch) =>
                ch.name.toLowerCase() === "general" &&
                ch.type === 0 &&
                ch.permissionsFor(guild.members.me).has("SendMessages"),
        );
    }

    // If still no channel, fall back to first available text channel
    if (!channel) {
        channel = guild.channels.cache.find(
            (ch) => ch.type === 0 && ch.permissionsFor(guild.members.me).has("SendMessages"),
        );
    }

    if (!channel) return;

    const welcomeEmbed = new EmbedBuilder()
        .setColor("#FFB6C1")
        .setTitle("🐕 Woof! I'm Yuki!")
        .setDescription(
            "Thank you for inviting me to your server! I'm a care companion bot that helps track my daily routines, schedules, and care needs.",
        )
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
                name: "📝 Quick Start",
                value: "Type `help` to see all available commands!",
                inline: false,
            },
            {
                name: "🔔 Features",
                value: "• Feeding time reminders\n• Cleaning schedule tracking\n• Vet appointment management\n• Daily care history",
                inline: false,
            },
        )
        .setFooter({
            text: "Yuki Care Bot | Type help to get started!",
            iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

    await channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.DISCORD_TOKEN);
