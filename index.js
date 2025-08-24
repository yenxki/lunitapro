import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands } from "./utils/loadCommands.js";
import { loadEvents } from "./utils/loadEvents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer config.json usando fs
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.config = config;

// Cargar comandos y eventos
loadCommands(client, path.join(__dirname, "commands"));
loadEvents(client, path.join(__dirname, "events"));

// ----------------- PRESENCIA DEL BOT -----------------
client.on("ready", () => {
    console.log(`${client.user.tag} está online!`);

    const prefix = client.config.prefix || "!";
    const cherryEmoji = "<:cherryblossomspin:1409020018443681834>";

    client.user.setPresence({
        activities: [{
            name: `Usa ${prefix}help para ver todos mis comandos ${cherryEmoji}`,
            type: 0 // Playing
        }],
        status: "online"
    });
});
// ------------------------------------------------------

client.login(config.token);
