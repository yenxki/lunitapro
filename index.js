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
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.config = config;

// Cargar comandos y eventos
loadCommands(client, path.join(__dirname, "commands"));
loadEvents(client, path.join(__dirname, "events"));

// ✅ Validación permisos antes de ejecutar comando
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd);
    if (!command) return;

    // Leer roles desde DB
    const rolesDB = JSON.parse(fs.readFileSync("./database/roles.json", "utf8"));
    const userId = message.author.id;

    if (command.requiredRole) {
        if (
            (command.requiredRole === "owner" && !rolesDB.owners.includes(userId)) &&
            (command.requiredRole === "admin" && !rolesDB.admins.includes(userId)) &&
            (command.requiredRole === "mod" && !rolesDB.mods.includes(userId)) &&
            (!rolesDB.roles[command.requiredRole] || !rolesDB.roles[command.requiredRole].includes(userId))
        ) {
            return message.reply("❌ No tienes permisos para usar este comando.");
        }
    }

    await command.execute(client, message, args);
});

client.login(config.token);
