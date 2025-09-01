const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const emojis = require("./emojis.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.prefix = config.prefix;
client.emojisJSON = emojis;
client.config = config;

// Embed global
client.createEmbed = (guild, description, title = "Lunita") => {
  return new EmbedBuilder()
    .setColor("#9b59b6")
    .setTitle(`${emojis.star} ${title}`)
    .setDescription(description)
    .setFooter({ text: `Servidor: ${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp();
};

// Cargar handler
require("./handler")(client);

// 🔹 Eventos
const eventsPath = "./events";
fs.readdirSync(eventsPath).forEach(file => {
  const event = require(`${eventsPath}/${file}`);
  const eventName = file.split(".")[0];

  if (eventName === "ready") {
    client.once("ready", () => event(client));
  } else if (eventName === "messageCreate") {
    client.on("messageCreate", (message) => event(client, message));
  } else {
    client.on(eventName, (...args) => event(client, ...args));
  }
});


client.login(process.env.DISCORD_TOKEN);
