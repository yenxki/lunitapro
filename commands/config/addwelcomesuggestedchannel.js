const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    name: "addwelcomesuggestedchannel",
    aliases: ["addwsc", "addsuggested"],
    description: "Agrega un canal recomendado a la bienvenida",
    usage: "!addwelcomesuggestedchannel <#canal>",
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

        let suggested = (await db.get(`welcomeSuggested_${message.guild.id}`)) || [];
        if (suggested.includes(channel.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription("⚠️ Ese canal ya está en la lista de recomendados.")
                ]
            });
        }

        suggested.push(channel.id);
        await db.set(`welcomeSuggested_${message.guild.id}`, suggested);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`✅ Canal ${channel} agregado a la lista de recomendados.`)
            ]
        });
    }
};
