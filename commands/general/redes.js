import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
  name: "redes",
  description: "Muestra las redes de Gera de manera divertida e informal.",
  async execute(message, args) {

    const serverIcon = message.guild.iconURL({ dynamic: true }) || "https://i.imgur.com/placeholder.png";

    const embed = new EmbedBuilder()
      .setColor(0xFF69B4)
      .setTitle("🌟 ¡Ey! Acompaña a Gera en sus aventuras!")
      .setThumbnail(serverIcon)
      .setDescription(`¡Hey! 😎 No te pierdas ningún live ni contenido cool de **Gera**. Síguela en todas sus redes y sé parte de la comunidad más divertida del mundo. Comenta, ríe, participa y no te quedes fuera de la acción. 🌟\n\nTe dejo sus redes para que estés siempre al día:`)
      .addFields(
        { name: "<:Linktree:1403557486270877746> Linktree", value: "[Mira todo aquí](https://linktr.ee/gerasaurio)", inline: false },
        { name: "<:Instagram:1403557528482087023> Instagram", value: "[Síguela aquí](https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr)", inline: false },
        { name: "<:WhatsApp:1403557614071054477> WhatsApp", value: "[Únete al canal](https://www.whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N)", inline: false },
        { name: "<:YouTube:1403557581536100463> YouTube", value: "[Suscríbete aquí](https://www.youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW)", inline: false },
        { name: "<:TikTok:1403557633553862656> TikTok", value: "[Mira sus videos](https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1)", inline: false },
        { name: "<:Roblox:1403560698864336997> Roblox", value: "[Visita su perfil](https://www.roblox.com/users/8917660484/profile)", inline: false }
      )
      .setFooter({ text: "¡Vamos, síguela y no seas como Pocoyo! 😎" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Linktree").setStyle(ButtonStyle.Link).setURL("https://linktr.ee/gerasaurio"),
      new ButtonBuilder().setLabel("Instagram").setStyle(ButtonStyle.Link).setURL("https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr"),
      new ButtonBuilder().setLabel("YouTube").setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW"),
      new ButtonBuilder().setLabel("TikTok").setStyle(ButtonStyle.Link).setURL("https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1")
    );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
