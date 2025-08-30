const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name:"redes",
    description:"Muestra las redes sociales de Gera",
    category:"Fun",
    run: async(client,message)=>{
        const emojis = JSON.parse(fs.readFileSync("./data/emojis.json","utf8"));
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.star} Redes de Gerasaurio`)
            .setColor("Purple")
            .setDescription(
                `${emojis.Linktree} [Linktree](https://linktr.ee/gerasaurio)\n`+
                `${emojis.Instagram} [Instagram](https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr)\n`+
                `${emojis.WhatsApp} [WhatsApp](https://whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N)\n`+
                `${emojis.Youtube} [YouTube](https://youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW)\n`+
                `${emojis.TikTok} [TikTok](https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1)\n`+
                `🎮 [Roblox](https://www.roblox.com/users/8917660484/profile)`
            )
            .setFooter({text:"¡Síguela en todas sus redes!"});
        message.channel.send({embeds:[embed]});
    }
};
