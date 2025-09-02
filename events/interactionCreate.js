const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../config.json");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const [action, suggestionId] = interaction.customId.split("_");

  const channel = interaction.guild.channels.cache.get(config.suggestionsChannelId);
  const logChannel = interaction.guild.channels.cache.get(config.suggestionsLogChannelId);
  if (!channel || !logChannel) return;

  const suggestionMessage = await channel.messages.fetch(suggestionId).catch(() => null);
  if (!suggestionMessage) return interaction.reply({ content: "❌ No se encontró la sugerencia original.", ephemeral: true });

  // 🔹 Votos
  if (action === "vote") {
    if (interaction.customId.startsWith("vote_yes") || interaction.customId.startsWith("vote_no")) {
      const voteType = interaction.customId.includes("yes") ? "Sí" : "No";

      await interaction.reply({ content: `Tu voto se ha registrado en el log. ✅`, ephemeral: true });

      // Guardar el voto en el canal de logs
      logChannel.send(`🗳️ **${interaction.user.tag}** votó **${voteType}** para la sugerencia: ${suggestionMessage.embeds[0].description}`);
    }
    return;
  }

  // 🔹 Aprobar/Rechazar
  if (action === "approve" || action === "reject") {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "❌ No tienes permisos para hacer esto.", ephemeral: true });
    }

    // Modal para la razón
    const modal = new ModalBuilder()
      .setCustomId(`${action}_reason_${suggestionMessage.id}`)
      .setTitle(action === "approve" ? "Aprobar Sugerencia" : "Rechazar Sugerencia");

    const input = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Escribe la razón por la cual fue aprobada/rechazada")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }
};
