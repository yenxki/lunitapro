const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { token } = require("./config");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Inicializar colecciones
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

// Cargar emojis
client.emojisData = require("./data/emojis.json");

// Handlers
require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/ready")(client);

client.login(token);
