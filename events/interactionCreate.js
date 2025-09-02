const fs = require("fs");
const path = require("path");
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const config = require("../config.json");

const suggestionsPath = path.join(__dirname, "../data/suggestions.json");

function loadSuggestions() {
  if (!fs.existsSync(suggestionsPath)) return {};
  return JSON.parse(fs.readFileSync(suggestionsPath, "utf8"));
}

function saveSuggestions(data) {
  fs.writeFileSync(suggestionsPath, JSON.stringify(data, null, 2));
}

module.exports = async (client, interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  // 🔹 Manejo de votos secretos
  if (interaction.isButton() && interaction.customId.startsWith("vote_")) {
    const suggestionId = interaction.customId.split("_")[2];
    const logChannel = interaction.guild.channels.cache.get(
      config.suggestionsLogChannelId
    );

    if (!logChannel) {
      return interaction.reply({
        content: "❌ No se encontró el canal de logs.",
        ephemeral: true,
      });
    }

    let suggestions = loadSuggestions();
    if (!suggestions[suggestionId]) {
      suggestions[suggestionId] = { yes: [], no: [] };
    }

    // 🔒 Validar si ya votó
    if (
      suggestions[suggestionId].yes.includes(interaction.user.id) ||
      suggestions[suggestionId].no.includes(interaction.user.id)
    ) {
      return interaction.reply({
        content: "⚠️ Ya has votado en esta sugerencia.",
        ephemeral: true,
      });
    }

    if (interaction.customId.includes("yes")) {
      suggestions[suggestionId].yes.push(interaction.user.id);
    } else {
      suggestions[suggestionId].no.push(interaction.user.id);
    }

    saveSuggestions(suggestions);

    await logChannel.send(
      `🗳️ **${interaction.user.tag}** votó en **${
        interaction.customId.includes("yes") ? "✅ Sí" : "❌ No"
      }** en la sugerencia \`${suggestionId}\`.`
    );

    return interaction.reply({
      content: "✅ Tu voto ha sido registrado en secreto.",
      ephemeral: true,
    });
  }

  // 🔹 Aprobar / Rechazar con modal
  if (interaction.isButton() && (interaction.customId.startsWith("approve_") || interaction.customId.startsWith("reject_"))) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ No tienes permisos para gestionar sugerencias.",
        ephemeral: true,
      });
    }

    const suggestionId = interaction.customId.split("_")[1];
    const modal = new ModalBuilder()
      .setCustomId(`${interaction.customId}_modal`)
      .setTitle(interaction.customId.startsWith("approve") ? "Aprobar sugerencia" : "Rechazar sugerencia");

    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Razón")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
    return interaction.showModal(modal);
  }

  // 🔹 Procesar modal
  if (interaction.isModalSubmit() && (interaction.customId.startsWith("approve_") || interaction.customId.startsWith("reject_"))) {
    const suggestionId = interaction.customId.split("_")[1];
    const reason = interaction.fields.getTextInputValue("reason");

    try {
      const suggestionChannel = interaction.guild.channels.cache.get(config.suggestionsChannelId);
      const suggestionMessage = await suggestionChannel.messages.fetch(suggestionId).catch(() => null);

      if (!suggestionMessage) {
        return interaction.reply({
          content: "❌ No se encontró la sugerencia original.",
          ephemeral: true,
        });
      }

      const embed = EmbedBuilder.from(suggestionMessage.embeds[0]);

      embed.data.fields = embed.data.fields.filter(f => f.name !== "Estado");

      embed.addFields({
        name: "Estado",
        value: interaction.customId.startsWith("approve")
          ? `🟢 Aprobada\n**Razón:** ${reason}`
          : `🔴 Rechazada\n**Razón:** ${reason}`,
      });

      await suggestionMessage.edit({
        embeds: [embed],
        components: [], // Desactivamos botones (ya no se puede votar)
      });

      return interaction.reply({
        content: `✅ Has ${
          interaction.customId.startsWith("approve") ? "aprobado" : "rechazado"
        } la sugerencia con razón: **${reason}**.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "❌ Hubo un error al procesar la sugerencia.",
        ephemeral: true,
      });
    }
  }
};
