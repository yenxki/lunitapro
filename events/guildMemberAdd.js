const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, member) => {
    const welcomeChannelId = await db.get(`welcomeChannel_${member.guild.id}`);
    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const suggestedChannels = (await db.get(`welcomeSuggested_${member.guild.id}`)) || [];
    let suggestedText = suggestedChannels.length
        ? suggestedChannels.map(id => `<#${id}>`).join(" | ")
        : "No hay canales recomendados configurados.";

    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`👋 ¡Bienvenido/a, ${member.user.username}!`)
        .setDescription(`Nos alegra que te unas a **${member.guild.name}**.\n\nAquí tienes algunos canales recomendados:\n${suggestedText}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "Esperamos que disfrutes tu estadía 💙" });

    channel.send({ embeds: [embed] });
};
