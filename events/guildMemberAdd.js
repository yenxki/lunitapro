const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./database.json" });
const { EmbedBuilder } = require("discord.js");

module.exports = (client, member) => {
    const channelId = db.get(`welcomeChannel_${member.guild.id}`);
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const suggested = db.get(`welcomeSuggested_${member.guild.id}`) || [];
    const suggestedText = suggested.map(id => `<#${id}>`).join("\n") || "No hay canales recomendados.";

    const embed = new EmbedBuilder()
        .setTitle("👋 ¡Bienvenido/a!")
        .setDescription(`Hola ${member}, bienvenido/a a **${member.guild.name}** 🎉\n\nTe recomendamos visitar:\n${suggestedText}`)
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "¡Esperamos que disfrutes tu estadía!" });

    channel.send({ embeds: [embed] });
};
