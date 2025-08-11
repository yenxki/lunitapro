const fs = require("fs");
const path = require("path");
const prefixesPath = path.join(__dirname, "../database/prefixes.json");

if (!fs.existsSync(prefixesPath)) fs.writeFileSync(prefixesPath, "{}");

module.exports = {
    getPrefix: (guildId) => {
        const data = JSON.parse(fs.readFileSync(prefixesPath, "utf8"));
        return data[guildId];
    },
    setPrefix: (guildId, prefix) => {
        const data = JSON.parse(fs.readFileSync(prefixesPath, "utf8"));
        data[guildId] = prefix;
        fs.writeFileSync(prefixesPath, JSON.stringify(data, null, 2));
    }
};
