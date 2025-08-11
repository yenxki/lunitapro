const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    name: "setwelcomechannel",
    aliases: ["setwc", "setwelcome"],
    description: "Establece el canal de bienvenida para el servidor",
    usage: "!setwelcomechannel <#canal>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("Administrator")) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No tienes permisos para usar este comando.")
                ]
            });
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== ChannelType.GuildText) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription("⚠️ Debes mencionar un canal de texto válido.")
                ]
            });
        }

        await db.set(`welcomeChannel_${message.guild.id}`, channel.id);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`✅ Canal de bienvenida establecido en ${channel}`)
            ]
        });
    }
};
