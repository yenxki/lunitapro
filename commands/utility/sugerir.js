const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "sugerir",
  description: "Envía una sugerencia al canal de sugerencias",
  category: "Utilidad",
  async execute({ client, message, args }) {
    const suggestionText = args.join(" ");
    if (!suggestionText) return message.reply("❌ Debes escribir tu sugerencia.");
    
    const wordCount = suggestionText.split(/\s+/).length;
    if (wordCount > 100) return message.reply("❌ La sugerencia no puede tener más de 100 palabras.");

    // Eliminar el mensaje original
    await message.delete();

    const suggestionsChannel = message.guild.channels.cache.get(config.suggestionsChannelId);
    if (!suggestionsChannel) return message.reply("⚠️ No se encontró el canal de sugerencias configurado.");

    const embed = new EmbedBuilder()
      .setColor("#00bcd4")
      .setAuthor({ name: `Nueva sugerencia de ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setDescription(`📢 **Sugerencia:**\n${suggestionText}`)
      .addFields({ name: "Estado", value: "⏳ Pendiente de ser revisada por los administradores." })
      .setFooter({ text: "Sistema de sugerencias", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("approve_suggestion").setLabel("Aprobar").setStyle(ButtonStyle.Success).setEmoji("✅"),
      new ButtonBuilder().setCustomId("reject_suggestion").setLabel("Rechazar").setStyle(ButtonStyle.Danger).setEmoji("❌")
    );

    await suggestionsChannel.send({ embeds: [embed], components: [row] });
  }
};
