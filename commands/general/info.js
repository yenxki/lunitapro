const { EmbedBuilder } = require("discord.js");
const emojis = require("../../utils/emojis");

module.exports = {
    name: "info",
    aliases: ["informacion", "gerasaurio"],
    category: "General",
    description: "Muestra información sobre la streamer dueña del bot: Gerasaurio",
    run: (client, message) => {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`Información de Gerasaurio`)
            .setDescription(`Aquí tienes los enlaces oficiales:`)
            .addFields(
                { name: `${emojis.Instagram} Instagram`, value: `[Perfil de Gerasaurio](https://www.instagram.com/gerasaurio)`, inline: true },
                { name: `${emojis.WhatsApp} WhatsApp`, value: `[Canal de WhatsApp](https://www.whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N)`, inline: true },
                { name: `${emojis.YouTube} YouTube`, value: `[Canal de Gerasaurio](https://www.youtube.com/@gerasaurio)`, inline: true },
                { name: `${emojis.TikTok} TikTok`, value: `[Perfil de TikTok](https://www.tiktok.com/@gerasaurio)`, inline: true },
                { name: `${emojis.Roblox} Roblox`, value: `[Perfil de Roblox](https://www.roblox.com/users/8917660484/profile)`, inline: true }
            )
            .setFooter({ text: "Sigue a Gerasaurio para más contenido 🎥" });

        message.channel.send({ embeds: [embed] });
    }
};
