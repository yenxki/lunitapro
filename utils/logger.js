const fs = require("fs");
const path = require("path");

const logPath = (guild) => path.join(__dirname, `../data/logs_${guild.id}.json`);
const historyPath = path.join(__dirname, "../data/history.json");

module.exports.sendLog = (client, guild, embed) => {
  const channel = guild.channels.cache.get(client.config.logChannelId);
  if (!channel) return;
  channel.send({ embeds: [embed] }).catch(() => {});
};

module.exports.addHistory = (userId, entry) => {
  let history = {};
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, "utf8"));
  }

  if (!history[userId]) history[userId] = [];
  history[userId].push({ ...entry, date: Date.now() });

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
};
