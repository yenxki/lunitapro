const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    // ✅ Botón Aprobar
    if (interaction.isButton() && interaction.customId === "approve_suggestion") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: "❌ Solo los administradores pueden aprobar sugerencias.", ephemeral: true });
      }

      const modal = new ModalBuilder()
        .setCustomId("approve_modal")
        .setTitle("Aprobar sugerencia");

      const reasonInput = new TextInputBuilder()
        .setCustomId("approve_reason")
        .setLabel("Motivo de la aprobación")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Escribe aquí el motivo por el cual apruebas la sugerencia...");

      modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
      return interaction.showModal(modal);
    }

    // ❌ Botón Rechazar
    if (interaction.isButton() && interaction.customId === "reject_suggestion") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: "❌ Solo los administradores pueden rechazar sugerencias.", ephemeral: true });
      }

      const modal = new ModalBuilder()
        .setCustomId("reject_modal")
        .setTitle("Rechazar sugerencia");

      const reasonInput = new TextInputBuilder()
        .setCustomId("reject_reason")
        .setLabel("Motivo del rechazo")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Escribe aquí el motivo por el cual rechazas la sugerencia...");

      modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
      return interaction.showModal(modal);
    }

    // 📩 Modal Aprobado
    if (interaction.isModalSubmit() && interaction.customId === "approve_modal") {
      const reason = interaction.fields.getTextInputValue("approve_reason");

      const embed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("Green")
        .spliceFields(0, 1, { name: "Estado", value: `✅ Aprobada por ${interaction.user.tag}\n📝 Motivo: ${reason}` });

      await interaction.update({ embeds: [embed], components: [] });

      const logChannel = interaction.guild.channels.cache.get(config.suggestionsLogChannelId);
      if (logChannel) logChannel.send({ content: `✅ Sugerencia aprobada por ${interaction.user.tag}`, embeds: [embed] });
    }

    // 📩 Modal Rechazado
    if (interaction.isModalSubmit() && interaction.customId === "reject_modal") {
      const reason = interaction.fields.getTextInputValue("reject_reason");

      const embed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("Red")
        .spliceFields(0, 1, { name: "Estado", value: `❌ Rechazada por ${interaction.user.tag}\n📝 Motivo: ${reason}` });

      await interaction.update({ embeds: [embed], components: [] });

      const logChannel = interaction.guild.channels.cache.get(config.suggestionsLogChannelId);
      if (logChannel) logChannel.send({ content: `❌ Sugerencia rechazada por ${interaction.user.tag}`, embeds: [embed] });
    }
  }
};
