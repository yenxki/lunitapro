const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./database.json" });

module.exports = {
    name: "addwelcomesuggestedchannel",
    description: "Agrega un canal recomendado para las bienvenidas",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            return message.reply("❌ No tienes permisos para usar este comando.");
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply("❌ Debes mencionar un canal válido.");
        }

        let suggested = db.get(`welcomeSuggested_${message.guild.id}`) || [];
        if (suggested.includes(channel.id)) {
            return message.reply("⚠️ Ese canal ya está en la lista.");
        }

        suggested.push(channel.id);
        db.set(`welcomeSuggested_${message.guild.id}`, suggested);

        message.reply(`✅ Canal ${channel} agregado a los recomendados.`);
    }
};
