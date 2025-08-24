import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    name: "help",
    description: "Muestra el panel de ayuda con paginación.",
    async execute(message, args, client) {
        const pages = [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("📚 Ayuda - Página 1")
                .setDescription("**Comandos Generales**\n\n" +
                    "🔹 `!help` — Muestra este panel.\n" +
                    "🔹 `!setprefix` — Cambia el prefijo del bot."),
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🎉 Ayuda - Página 2")
                .setDescription("**Comandos de Sorteos**\n\n" +
                    "🎁 `!giveaway` — Crea un sorteo.\n" +
                    "⚙ `!giveaway-config` — Configura opciones del sorteo."),
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🌐 Ayuda - Página 3")
                .setDescription("**Otros Comandos**\n\n" +
                    "📌 `!redes` — Muestra enlaces importantes.")
        ];

        let page = 0;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("prev").setLabel("⬅").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("next").setLabel("➡").setStyle(ButtonStyle.Primary)
        );

        const msg = await message.channel.send({ embeds: [pages[page]], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) return i.reply({ content: "No puedes usar esto.", ephemeral: true });

            if (i.customId === "next") page = (page + 1) % pages.length;
            else if (i.customId === "prev") page = (page - 1 + pages.length) % pages.length;

            await i.deferUpdate();
            await msg.edit({ embeds: [pages[page]], components: [row] });
        });

        collector.on("end", async () => {
            row.components.forEach(btn => btn.setDisabled(true));
            await msg.edit({ components: [row] });
        });
    }
};
