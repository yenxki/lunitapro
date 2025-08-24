const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'redes',
  category: 'Información',
  description: 'Muestra las redes sociales oficiales de Gerasaurio (paginado).',
  usage: '!redes',
  async execute(message) {
    const page1 = new EmbedBuilder()
      .setColor(0x1ABC9C)
      .setTitle('＜:Linktree:1403557486270877746＞ Linktree')
      .setDescription('[linktr.ee/gerasaurio](https://linktr.ee/gerasaurio)')
      .setFooter({ text: 'Página 1/3' });

    const page2 = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('＜:Streamer:1403559807436325025＞ Redes Sociales')
      .setDescription([
        '＜:Instagram:1403557528482087023＞ **Instagram:** https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr',
        '＜:WhatsApp:1403557614071054477＞ **WhatsApp Canal:** https://www.whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N',
        '＜:YouTube:1403557581536100463＞ **YouTube:** https://www.youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW',
        '＜:TikTok:1403557633553862656＞ **TikTok:** https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1'
      ].join('\n'))
      .setFooter({ text: 'Página 2/3' });

    const page3 = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle('＜:Roblox:1403560698864336997＞ Juegos')
      .setDescription('**Roblox:** https://www.roblox.com/users/8917660484/profile')
      .setFooter({ text: 'Página 3/3' });

    const embeds = [page1, page2, page3];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('redes:prev:0')
        .setEmoji({ name: 'arrow_left', id: '1403777608138887189' })
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('redes:next:0')
        .setEmoji({ name: 'arrow_right', id: '1403777582440251393' })
        .setStyle(ButtonStyle.Secondary)
    );

    const sent = await message.channel.send({ embeds: [embeds[0]], components: [row] });
    if (!message.client.redesEmbeds) message.client.redesEmbeds = {};
    message.client.redesEmbeds[sent.id] = embeds;
  }
};
