import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands } from "./utils/loadCommands.js";
import { loadEvents } from "./utils/loadEvents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.config = config;

// Presencia inicial
client.once("ready", () => {
    client.user.setPresence({
        activities: [{ name: `${config.prefix}help para ver mis comandos 🌸`, type: 0 }],
        status: "online"
    });
    console.log(`Conectado como ${client.user.tag}`);
});

// Cargar comandos y eventos
loadCommands(client, path.join(__dirname, "commands"));
loadEvents(client, path.join(__dirname, "events"));

client.login(config.token);
