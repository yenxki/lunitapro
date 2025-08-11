const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const config = require("./config.json");
const prefixManager = require("./utils/prefixManager");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.aliases = new Collection();

// Handler de comandos
const loadCommands = (dir = "./commands") => {
    fs.readdirSync(dir).forEach(subDir => {
        const files = fs.readdirSync(`${dir}/${subDir}`).filter(file => file.endsWith(".js"));
        for (const file of files) {
            const command = require(`${dir}/${subDir}/${file}`);
            client.commands.set(command.name, command);
            if (command.aliases) {
                command.aliases.forEach(alias => client.aliases.set(alias, command.name));
            }
        }
    });
};

// Handler de eventos
const loadEvents = (dir = "./events") => {
    const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`${dir}/${file}`);
        const eventName = file.split(".")[0];
        client.on(eventName, (...args) => event(client, ...args));
    }
};

// Cargar todo
loadCommands();
loadEvents();

client.on("guildMemberAdd", member => {
    require("./events/guildMemberAdd.js")(client, member);
});

client.login(process.env.DISCORD_TOKEN);
