const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../database/verification.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ configs: {}, verified: {} }, null, 2));
}

module.exports = {
    getConfig: (guildId) => {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return data.configs[guildId] || null;
    },
    setConfig: (guildId, channelId, roleId) => {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        data.configs[guildId] = { channelId, roleId };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
    markVerified: (guildId, userId) => {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (!data.verified[guildId]) data.verified[guildId] = [];
        if (!data.verified[guildId].includes(userId)) data.verified[guildId].push(userId);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
    isVerified: (guildId, userId) => {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return data.verified[guildId]?.includes(userId) || false;
    }
};
