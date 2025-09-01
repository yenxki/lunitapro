const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "help",
  description: "Muestra todos los comandos disponibles con navegación por botones",
    category: "Todos",
  async execute({ client, message, args, createEmbed }) {

    // Agrupar comandos por categoría
    const categories = {};
    client.commands.forEach(cmd => {
      const category = cmd.category || "Sin categoría";
      if (!categories[category]) categories[category] = [];
      categories[category].push(`\`${client.prefix}${cmd.name}\` - ${cmd.description}`);
    });

    const categoryEntries = Object.entries(categories);
    if (categoryEntries.length === 0) return;

    const pages = categoryEntries.map(([cat, cmds]) => {
      return createEmbed(
        message.guild,
        cmds.join("\n"),
        `${client.emojisJSON[cat] || "⭐"} ${cat}`
      );
    });

    let currentPage = 0;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setStyle(ButtonStyle.Primary)
        .setEmoji(client.emojisJSON["Arrow-left"]),
      new ButtonBuilder()
        .setCustomId("next")
        .setStyle(ButtonStyle.Primary)
        .setEmoji(client.emojisJSON["Arrow-right"])
    );

    const helpMessage = await message.channel.send({ embeds: [pages[currentPage]], components: [row] });

    const collector = helpMessage.createMessageComponentCollector({
      filter: i => i.user.id === message.author.id,
      time: 120000
    });

    collector.on("collect", async i => {
      if (!i.isButton()) return;

      if (i.customId === "prev") currentPage = currentPage > 0 ? currentPage - 1 : pages.length - 1;
      if (i.customId === "next") currentPage = currentPage < pages.length - 1 ? currentPage + 1 : 0;

      await i.update({ embeds: [pages[currentPage]] });
    });

    collector.on("end", async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map(c => c.setDisabled(true))
      );
      helpMessage.edit({ components: [disabledRow] }).catch(() => {});
    });
  }
};
