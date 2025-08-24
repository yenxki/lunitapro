const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'servers.json');

function initDB() {
  fs.ensureFileSync(DB_PATH);
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8') || '{}';
    JSON.parse(raw);
  } catch {
    fs.writeFileSync(DB_PATH, '{}', 'utf8');
  }
}

function readDB() {
  initDB();
  const raw = fs.readFileSync(DB_PATH, 'utf8') || '{}';
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function ensureGuild(guildId) {
  const db = readDB();
  if (!db[guildId]) {
    db[guildId] = {
      prefix: null,
      welcomeChannelId: null,
      giveawayCategoryId: null,
      giveawayManagerRoleIds: []
    };
    writeDB(db);
  }
  return db;
}

function getGuildConfig(guildId) {
  const db = ensureGuild(guildId);
  return db[guildId];
}

function setGuildConfig(guildId, patch) {
  const db = ensureGuild(guildId);
  db[guildId] = { ...db[guildId], ...patch };
  writeDB(db);
  return db[guildId];
}

module.exports = {
  readDB,
  writeDB,
  getGuildConfig,
  setGuildConfig
};
