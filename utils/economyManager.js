const fs = require("fs");
const path = require("path");
const economyPath = path.join(__dirname, "../database/economy.json");
const abbreviations = require("./numberAbbreviations");

if (!fs.existsSync(economyPath)) fs.writeFileSync(economyPath, "{}");

module.exports = {
    getBalance: (userId, guildId) => {
        const data = JSON.parse(fs.readFileSync(economyPath, "utf8"));
        return data[guildId]?.[userId] || 0;
    },
    addBalance: (userId, guildId, amount) => {
        const data = JSON.parse(fs.readFileSync(economyPath, "utf8"));
        if (!data[guildId]) data[guildId] = {};
        if (!data[guildId][userId]) data[guildId][userId] = 0;
        data[guildId][userId] += amount;
        fs.writeFileSync(economyPath, JSON.stringify(data, null, 2));
    },
    setBalance: (userId, guildId, amount) => {
        const data = JSON.parse(fs.readFileSync(economyPath, "utf8"));
        if (!data[guildId]) data[guildId] = {};
        data[guildId][userId] = amount;
        fs.writeFileSync(economyPath, JSON.stringify(data, null, 2));
    },
    formatBalance: (amount) => abbreviations.format(amount),
    parseBalance: (str) => abbreviations.parse(str)
};
