const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

module.exports.executeHelp = async (message, client, prefix) => {
    // Cargar emojis
    const emojisData = client.emojisData;

    const embed = new EmbedBuilder()
        .setTitle(`${emojisData.star || ""} Menú de Comandos`)
        .setDescription(`Selecciona una categoría con los botones para ver sus comandos.\nPrefijo actual: \`${prefix}\``)
        .setColor("Blue")
        .setFooter({ text: `Bot desarrollado por Gerasaurio` });

    const row = new ActionRowBuilder();

    client.categories.forEach(cat => {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`help_${cat}`)
                .setLabel(`${emojisData[cat] || ""} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`)
                .setStyle(ButtonStyle.Primary)
        );
    });

    await message.channel.send({ embeds: [embed], components: [row] });
};
