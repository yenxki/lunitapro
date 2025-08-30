const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "redes",
    aliases: [],
    description: "Muestra las redes sociales de Gerasaurio",
    usage: "redes",
    category: "Fun",
    run: async (client, message, args, prefix) => {

        // Cargar emojis desde emojis.json
        const emojisData = JSON.parse(fs.readFileSync("./data/emojis.json", "utf8"));

        const embed = new EmbedBuilder()
            .setTitle(`${emojisData.star} Redes sociales de Gerasaurio`)
            .setColor("Purple")
            .setDescription(
                `${emojisData.Linktree} [Linktree](https://linktr.ee/gerasaurio)\n` +
                `${emojisData.Instagram} [Instagram](https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr)\n` +
                `${emojisData.WhatsApp} [WhatsApp](https://whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N)\n` +
                `${emojisData.Youtube} [YouTube](https://youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW)\n` +
                `${emojisData.TikTok} [TikTok](https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1)\n` +
                `${emojisData.Roblox} [Roblox](https://www.roblox.com/users/8917660484/profile)`
            )
            .setFooter({ text: "¡Síguela en todas sus redes!" });

        message.channel.send({ embeds: [embed] });
    }
};
