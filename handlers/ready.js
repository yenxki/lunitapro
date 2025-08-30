const { ActivityType, Colors } = require("discord.js");

module.exports = (client) => {
    client.on("ready", async () => {
        console.clear();

        console.log("=======================================");
        console.log(`Bot iniciado correctamente!`);
        console.log(`Usuario: ${client.user.tag}`);
        console.log(`Servidores: ${client.guilds.cache.size}`);
        console.log(`Comandos cargados: ${client.commands.size}`);
        console.log("=======================================");

        // Configurar presencia personalizada
        client.user.setPresence({
            activities: [
                {
                    name: "Gerasaurio en TikTok",
                    type: ActivityType.Watching, // Puedes cambiar: Playing, Listening, Watching, Competing
                }
            ],
            status: "online" // online, idle, dnd, invisible
        });

        console.log(`Presencia establecida: Watching Gerasaurio en TikTok`);
    });
};
