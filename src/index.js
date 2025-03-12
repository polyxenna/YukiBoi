const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { setupFeedingReminders } = require("./reminders/feeding");
const { setupCleaningReminders } = require("./reminders/cleaning");
const { handleFedCommand } = require("./commands/fed");
const { handleCleanedCommand } = require("./commands/cleaned");
const { historyResponses, getRandomResponse, scheduleViewResponses, scheduleRemovalResponses } = require("./utils/messages");
const { getFeedingPeriod, getFeedingPeriodFromTime } = require("./utils/timeCheck");
const EventScheduler = require("./utils/scheduler");
const { startServer } = require("./server");

dotenv.config();
startServer();


function generateDailySummary() {
    const summaryEmbed = new EmbedBuilder()
        .setColor("#FFB6C1")
        .setTitle("🐕 Yuki's Daily Care Summary")
        .setDescription("@everyone *Here's how my day went!*")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
                name: "🍽️ Feeding History",
                value:
                    feedingHistory.length === 0
                        ? "*No meals recorded today*"
                        : feedingHistory
                              .map((record) => {
                                  const time = record.time.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  });
                                  return `• ${record.period} meal at ${time} by ${record.fedBy}`;
                              })
                              .join("\n"),
                inline: false,
            },
            {
                name: "🧹 Cleaning Status",
                value: feedingStatus.cleaned
                    ? "✅ Area was cleaned today!"
                    : "❌ Area was not cleaned today",
                inline: false,
            },
        )
        .setFooter({
            text: "End of Day Report",
            iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

    return summaryEmbed;
}

// Define slash commands
const commands = [
    new SlashCommandBuilder()
        .setName("feed")
        .setDescription("Mark Yuki as fed")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("Specify feeding time (optional)")
                .setRequired(false),
        ),

    new SlashCommandBuilder().setName("clean").setDescription("Mark Yuki's area as cleaned"),

    new SlashCommandBuilder()
        .setName("history")
        .setDescription("View Yuki's feeding history for today"),

    new SlashCommandBuilder().setName("schedule").setDescription("View all upcoming events"),

    new SlashCommandBuilder()
        .setName("sched")
        .setDescription("Schedule a new event")
        .addStringOption((option) =>
            option.setName("event").setDescription("Event name").setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("date").setDescription("Event date (MM/DD/YYYY)").setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("time").setDescription("Event time (HH:MM AM/PM)").setRequired(true),
        ),

    new SlashCommandBuilder().setName("help").setDescription("Show all available commands"),

    new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove a scheduled event")
        .addStringOption((option) =>
            option.setName("event").setDescription("Event name to remove").setRequired(true),
        ),
    
    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite YukiBoi to your server!"),
];

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
cron.schedule("59 23 * * *", async () => {
    // Send daily summary before reset
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (channel) {
        const summaryEmbed = generateDailySummary();
        await channel.send({ embeds: [summaryEmbed] });
    }

    // Reset status and history
    feedingStatus = {
        morning: false,
        afternoon: false,
        evening: false,
        cleaned: false,
    };
    feedingHistory = [];
});

// Register commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    switch (commandName) {
        case "feed":
            const timeOption = options.getString("time");
            if (timeOption) {
                const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]( ?(?:AM|PM|am|pm)?)?$/;

                if (!timeRegex.test(timeOption)) {
                    await interaction.reply("❌ Please use the format: HH:MM or HH:MM AM/PM");
                    return;
                }

                const period = getFeedingPeriodFromTime(timeOption);
                if (!period) {
                    await interaction.reply(
                        "⚠️ That time doesn't fall within regular feeding hours!",
                    );
                    return;
                }

                if (feedingHistory.some((feed) => feed.period === period)) {
                    await interaction.reply(`⚠️ Yuki has already been fed during ${period} time!`);
                    return;
                }

                const [timeOnly, ampm] = timeOption.split(" ");
                let [hours, minutes] = timeOnly.split(":").map(Number);

                if (ampm && ampm.toLowerCase() === "pm" && hours !== 12) hours += 12;
                if (ampm && ampm.toLowerCase() === "am" && hours === 12) hours = 0;

                const feedTime = new Date();
                feedTime.setHours(hours, minutes, 0);

                feedingStatus[period] = true;
                feedingHistory.push({
                    period: period,
                    time: feedTime,
                    fedBy: interaction.user.username,
                });

                await interaction.reply(`✅ Logged feeding time for ${period} at ${timeOption}!`);
            } else {
                const period = getFeedingPeriod();
                if (!period) {
                    await interaction.reply("⚠️ It's not feeding time right now!");
                    return;
                }
                if (feedingStatus[period]) {
                    await interaction.reply("⚠️ Yuki has already been fed for this meal time!");
                    return;
                }
                feedingStatus[period] = true;
                feedingHistory.push({
                    period: period,
                    time: new Date(),
                    fedBy: interaction.user.username,
                });
                await handleFedCommand(interaction, feedingStatus);
            }
            break;

        case "clean":
            await handleCleanedCommand(interaction, feedingStatus);
            break;

        case "history":
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

            await interaction.reply(historyMsg);
            break;

        case "schedule":
            const { getUpcomingSchedules } = require("./config/constants");
            const schedules = getUpcomingSchedules();
            const header = getRandomResponse(scheduleViewResponses);

            if (schedules.length === 0) {
                await interaction.reply(`${header}\n\n*No upcoming events scheduled!*`);
                return;
            }

            let scheduleMsg = `${header}\n\n`;
            schedules.forEach((schedule) => {
                scheduleMsg += `🔸 **${schedule.event}**\n`;
                scheduleMsg += `   📅 Date: ${schedule.date}\n`;
                scheduleMsg += `   ⏰ Time: ${schedule.time}\n`;
                scheduleMsg += `   ⌛ In: ${schedule.timeUntil}\n\n`;
            });

            await interaction.reply(scheduleMsg);
            break;

        case "sched":
            const event = options.getString("event");
            const date = options.getString("date");
            const time = options.getString("time");

            try {
                const dateTimeStr = `${date} ${time}`;
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

                await interaction.reply(
                    `🗓️ Got it! I'll remind everyone about my ${event} on ${formattedDate} at ${formattedTime}`,
                );
            } catch (error) {
                await interaction.reply("❌ Please use the correct format for date and time!");
            }
            break;

        case "help":
            const helpEmbed = new EmbedBuilder()
                .setColor("#FFB6C1")
                .setTitle("🐕 Yuki's Care Commands")
                .setDescription("*Woof! Here are all the ways you can help take care of me!*")
                .setThumbnail(client.user.displayAvatarURL())
                .addFields(
                    {
                        name: "🍽️ Feeding Commands",
                        value: "`/feed` - Mark my meal as given\n`/feed [time]` - Log a past feeding time\n`/history` - See my feeding record for today",
                        inline: false,
                    },
                    {
                        name: "\n",
                        value: "\n",
                        inline: false,
                    },
                    {
                        name: "🧹 Cleaning Commands",
                        value: "`/clean` - Mark my area as cleaned",
                        inline: false,
                    },
                    {
                        name: "\n",
                        value: "\n",
                        inline: false,
                    },
                    {
                        name: "📅 Schedule Commands",
                        value: "`/schedule` - View all my upcoming events\n`/sched [event] [date] [time]` - Schedule an event\n`/remove [event]` - Remove an event",
                        inline: false,
                    },
                    {
                        name: "\n",
                        value: "\n",
                        inline: false,
                    },
                    {
                        name: "🔗 Other Commands",
                        value: "`/help` - Show this message\n`/invite` - Invite me to your server!",
                        inline: false,
                    },
                )
                .setFooter({
                    text: "YukiBoi",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [helpEmbed] });
            break;

        case "remove":
            const eventToRemove = options.getString("event");
            const { removeSchedule } = require("./config/constants");
            const removed = removeSchedule(eventToRemove);

            if (removed) {
                await interaction.reply(
                    `✅ Successfully removed "${eventToRemove}" from the schedule!`,
                );
            } else {
                await interaction.reply(
                    `❌ Couldn't find an event named "${eventToRemove}" in the schedule.`,
                );
            }
            break;

        case "invite":
            const inviteEmbed = new EmbedBuilder()
                .setColor("#FFB6C1")
                .setTitle("🐕 Invite Yuki to Your Server!")
                .setDescription(
                    `[Click here to invite me!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274878221376&scope=bot%20applications.commands)`,
                )
                .setThumbnail(client.user.displayAvatarURL())
                .addFields({
                    name: "🔔 Features",
                    value: "• Feeding time reminders\n• Cleaning schedule tracking\n• Vet appointment management\n• Daily care history",
                    inline: false,
                })
                .setFooter({
                    text: "Woof! I can't wait to meet new friends!",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [inviteEmbed] });
            break;
    }
});

client.once("ready", () => {
    console.log("Yuki Care Bot is online! 🐕");
    scheduler = new EventScheduler(client);
    setupFeedingReminders(client, feedingStatus);
    setupCleaningReminders(client);
});

// Welcome message for new servers
client.on("guildCreate", async (guild) => {
    let channel = guild.systemChannel;

    if (!channel) {
        channel = guild.channels.cache.find(
            (ch) =>
                ch.name.toLowerCase() === "general" &&
                ch.type === 0 &&
                ch.permissionsFor(guild.members.me).has("SendMessages"),
        );
    }

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
                value: "Type `/help` to see all available commands!",
                inline: false,
            },
            {
                name: "🔔 Features",
                value: "• Feeding time reminders\n• Cleaning schedule tracking\n• Vet appointment management\n• Daily care history",
                inline: false,
            },
        )
        .setFooter({
            text: "Yuki Care Bot | Type /help to get started!",
            iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

    await channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.DISCORD_TOKEN);
