const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const emojis = require("../emojis.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#00bcd4")
      .setAuthor({
        name: `${emojis.star} ¡Bienvenido a ${member.guild.name}!`,
        iconURL: member.guild.iconURL({ dynamic: true })
      })
      .setThumbnail(member.guild.iconURL({ dynamic: true }))
      .setDescription(
        `${emojis.Cherry} **${member.user}**, nos alegra mucho tenerte aquí.\n\n` +
        `Este servidor es la ${emojis.Star} **comunidad oficial de Gerasaurio** 🦖. Esperamos que disfrutes tu estadía, pero antes te dejamos algunas recomendaciones importantes:\n\n` +
        `${emojis.Arrow-spin} **Lee nuestras reglas en <#1395860893765734470>** para mantener el orden y la buena vibra.\n\n` +
        `${emojis.Arrow-spin} **Mantente al pendiente de los directos de Gera** en <#1411985285436412014>. ¡No te pierdas ningún stream y acompáñanos en cada transmisión! \n\n` +
        `${emojis.Arrow-spin} Pásate por <#1411952197943562330>, el canal exclusivo donde **Gera platica directamente con la comunidad**.\n\n` +
        `${emojis.Arrow-spin} || "💬"} Y no olvides pasar por <#1395517066269818965> para saludar, conocer gente y empezar tu aventura junto a la familia muyaya.\n\n` +
        `${emojis.Cherry} Estamos muy felices de que formes parte de esta comunidad. ¡Diviértete, comparte y haz nuevos amigos! ${emojis.Star}`
      )
      .setFooter({
        text: `${emojis.star} Sistema de Bienvenida`,
        iconURL: member.user.displayAvatarURL()
      })
      .setTimestamp();

    channel.send({ content: `${emojis.star} ¡Bienvenido ${member.user}!`, embeds: [embed] });
  }
};
