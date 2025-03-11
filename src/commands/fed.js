const { getFeedingPeriod } = require("../utils/timeCheck");
const { fedResponses } = require("../utils/messages");

function handleFedCommand(message, feedingStatus) {
    const period = getFeedingPeriod();
    if (period) {
        feedingStatus[period] = true;
        const randomResponse = fedResponses[Math.floor(Math.random() * fedResponses.length)];
        message.reply(randomResponse);
    } else {
        message.reply("🤔 This doesn't seem to be around a regular feeding time!");
    }
}

module.exports = { handleFedCommand };
