const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = async (client, interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  // 🔹 Votos
  if (interaction.isButton() && (interaction.customId.startsWith("vote_yes_") || interaction.customId.startsWith("vote_no_"))) {
    const suggestionId = interaction.customId.split("_")[2];
    const logChannel = interaction.guild.channels.cache.get(config.suggestionsLogChannelId);
    if (!logChannel) return;

    const voteType = interaction.customId.includes("yes") ? "✅ A FAVOR" : "❌ EN CONTRA";
    logChannel.send(`📊 ${interaction.user.tag} votó **${voteType}** en la sugerencia con ID: ${suggestionId}`);
    return interaction.reply({ content: "✅ Tu voto fue registrado (secreto).", ephemeral: true });
  }

  // 🔹 Aprobar / Rechazar
  if (interaction.isButton() && (interaction.customId.startsWith("approve_") || interaction.customId.startsWith("reject_"))) {
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({ content: "❌ Solo administradores pueden aprobar o rechazar sugerencias.", ephemeral: true });

    const action = interaction.customId.startsWith("approve_") ? "Aprobar" : "Rechazar";
    const suggestionId = interaction.customId.split("_")[1];

    const modal = new ModalBuilder()
      .setCustomId(`modal_${action.toLowerCase()}_${suggestionId}`)
      .setTitle(`${action} sugerencia`);

    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel(`Explica por qué se ${action.toLowerCase()} la sugerencia`)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
    return interaction.showModal(modal);
  }

  // 🔹 Manejo de Modal (aprobación / rechazo)
  if (interaction.isModalSubmit() && (interaction.customId.startsWith("modal_approve_") || interaction.customId.startsWith("modal_reject_"))) {
    const [_, action, suggestionId] = interaction.customId.split("_");
    const reason = interaction.fields.getTextInputValue("reason");
    const channel = interaction.channel;

    try {
      const msg = await channel.messages.fetch(suggestionId);
      if (!msg) return interaction.reply({ content: "❌ No se encontró la sugerencia original.", ephemeral: true });

      const embed = EmbedBuilder.from(msg.embeds[0]);
      embed.fields = []; // limpiar estado viejo
      embed.addFields({
        name: "Estado",
        value: action === "approve" ? `✅ Aprobada\n📝 Razón: ${reason}` : `❌ Rechazada\n📝 Razón: ${reason}`,
      });

      await msg.edit({ embeds: [embed], components: [] });
      return interaction.reply({ content: `Sugerencia ${action === "approve" ? "aprobada" : "rechazada"} con éxito.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "❌ Error al actualizar la sugerencia.", ephemeral: true });
    }
  }
};
