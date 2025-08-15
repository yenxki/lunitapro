const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./database.json" });

module.exports = {
    name: "setwelcomechannel",
    description: "Configura el canal de bienvenida",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            return message.reply("❌ No tienes permisos para usar este comando.");
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply("❌ Debes mencionar un canal válido.");
        }

        db.set(`welcomeChannel_${message.guild.id}`, channel.id);
        message.reply(`✅ Canal de bienvenida establecido en ${channel}`);
    }
};
