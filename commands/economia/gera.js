const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const questions = require("../../utils/questions");
const economyManager = require("../../utils/economyManager");

module.exports = {
    name: "gera",
    aliases: ["ganar", "earn"],
    category: "Economía",
    description: "Juego rápido para ganar monedas",
    run: async (client, message) => {
        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("💰 Gana monedas")
            .setDescription("Tienes **10 segundos** para presionar el botón y responder una pregunta.");

        const button = new ButtonBuilder()
            .setCustomId(`gera_${message.author.id}`)
            .setLabel("¡Jugar!")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        setTimeout(() => {
            msg.edit({ components: [] }).catch(() => {});
        }, 10000);
    }
};
