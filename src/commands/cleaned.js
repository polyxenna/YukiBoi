const { cleanedResponses } = require("../utils/messages");

function handleCleanedCommand(message, feedingStatus) {
    feedingStatus.cleaned = true;
    const randomResponse = cleanedResponses[Math.floor(Math.random() * cleanedResponses.length)];
    message.reply(randomResponse);
}

module.exports = { handleCleanedCommand };
