const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

// Cliente
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Colecciones
client.commands = new Collection();
client.cooldowns = new Collection();

// Config
const config = JSON.parse(fs.readFileSync("./config.json","utf8"));
client.prefixes = new Collection(); // prefijos por servidor opcional

// Cargar comandos
const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders){
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(f=>f.endsWith(".js"));
    for(const file of commandFiles){
        const cmd = require(`./commands/${folder}/${file}`);
        if(cmd.name) client.commands.set(cmd.name,cmd);
    }
}
console.log("✅ Comandos cargados");

// Cargar eventos
const eventFiles = fs.readdirSync("./events").filter(f=>f.endsWith(".js"));
for(const file of eventFiles){
    const event = require(`./events/${file}`);
    if(file.startsWith("clientReady")) client.once("clientReady",(...args)=>event(client,...args));
    else client.on(file.split(".")[0],(...args)=>event(client,...args));
}
console.log("✅ Eventos cargados");

// Login
client.login(config.token);
