const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "redes",
  description: "Muestra las redes oficiales de Gerasaurio con botones y embed profesional.",
    category: "Todos",
  async execute({ client, message, createEmbed }) {

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Linktree")
        .setStyle(ButtonStyle.Link)
        .setURL("https://linktr.ee/gerasaurio")
        .setEmoji(client.emojisJSON.Linktree),

      new ButtonBuilder()
        .setLabel("Instagram")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.instagram.com/gerasaurio")
        .setEmoji(client.emojisJSON.Instagram),

      new ButtonBuilder()
        .setLabel("WhatsApp")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N")
        .setEmoji(client.emojisJSON.WhatsApp),

      new ButtonBuilder()
        .setLabel("YouTube")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.youtube.com/@gerasaurio")
        .setEmoji(client.emojisJSON.Youtube),

      new ButtonBuilder()
        .setLabel("TikTok")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.tiktok.com/@gerasaurio")
        .setEmoji(client.emojisJSON.TikTok)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Roblox")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.roblox.com/users/8917660484/profile")
        .setEmoji(client.emojisJSON.Roblox)
    );

    const embedDescription = `
    ${client.emojisJSON.Cherry}Aqui tienes todas mis redes oficiales!
    `;

    const embed = createEmbed(
      message.guild,
      embedDescription,
      `${client.emojisJSON.Fun} Gerasaurio`
    );

    await message.channel.send({ embeds: [embed], components: [row1, row2] });
  }
};
