const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Yuki Care Bot is running! 🐕");
});

const startServer = () => {
    app.listen(port, () => {
        console.log(`Web server running on port ${port}`);
    });
};

module.exports = { startServer };
