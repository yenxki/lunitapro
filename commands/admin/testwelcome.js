const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../emojis.json");

module.exports = {
  name: "testwelcome",
  description: "Prueba cómo se vería el mensaje de bienvenida.",
  category: "Admin",
  async execute({ client, message }) {
    const channel = message.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return message.reply(`${emojis.error} No se encontró el canal de bienvenida configurado.`);

    const embed = new EmbedBuilder()
      .setColor("#00bcd4")
      .setAuthor({
        name: `${emojis.star} ¡Bienvenido a ${message.guild.name}!`,
        iconURL: message.guild.iconURL({ dynamic: true })
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        `${emojis.Cherry} **${message.author}**, nos alegra mucho tenerte aquí.\n\n` +
        `Este servidor es la ${emojis.Star} **comunidad oficial de Gerasaurio** 🦖. Esperamos que disfrutes tu estadía, pero antes te dejamos algunas recomendaciones:\n\n` +
        `${emojis.Arrowspin} **Lee nuestras reglas en <#1395860893765734470>** para mantener el orden y la buena vibra.\n\n` +
        `${emojis.Arrowspin} **Mantente al pendiente de los directos de Gera** en <#1411985285436412014>. ¡No te pierdas ningún stream y acompáñanos en cada transmisión! \n\n` +
        `${emojis.Arrowspin} Pásate por <#1411952197943562330>, el canal exclusivo donde **Gera platica directamente con la comunidad**.\n\n` +
        `${emojis.Arrowspin} || "💬"} Y no olvides pasar por <#1395517066269818965> para saludar, conocer gente y empezar tu aventura junto a la familia muyaya.\n\n` +
        `${emojis.Cherry} Estamos muy felices de que formes parte de esta comunidad. ¡Diviértete, comparte y haz nuevos amigos! ${emojis.star}`
      )
      .setFooter({
        text: `${emojis.star} Sistema de Bienvenida (Test)`,
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp();

    channel.send({ content: `${emojis.star} ¡Bienvenido ${message.author}! (Test)`, embeds: [embed] });
  }
};
