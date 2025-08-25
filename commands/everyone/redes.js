// commands/info/redes.js
const { EmbedBuilder } = require('discord.js');
const { paginate } = require('../../utils/pagination');
const EMO = require('../../data/emojis.json');
const config = require('../../config.json');

const eLinktree = EMO.linktree ?? '🌐';
const eIG = EMO.instagram ?? '📷';
const eWA = EMO.whatsapp ?? '💬';
const eYT = EMO.youtube ?? '▶️';
const eTT = EMO.tiktok ?? '🎵';
const eRBX = EMO.roblox ?? '🎮';

module.exports = {
  name: 'redes',
  aliases: ['social', 'socials', 'links'],
  description: 'Muestra las redes oficiales de Gerasaurio con un formato paginado.',
  usage: '!redes',
  run: async (client, message) => {
    const prefix = client.prefixes[message.guild.id] || config.defaultPrefix;

    // Página 1 — Linktree
    const p1 = new EmbedBuilder()
      .setColor('#00C853')
      .setAuthor({ name: 'Redes Oficiales — Página 1/3' })
      .setTitle(`${eLinktree} Hub principal de enlaces`)
      .setDescription(
        `El **punto central** donde se agrupan todos los accesos de Gerasaurio.\n\n` +
        `> ${eLinktree} **Linktree:** https://linktr.ee/gerasaurio\n\n` +
        `Desde aquí podrás saltar a las demás plataformas, proyectos y novedades sin perderte.`
      )
      .setFooter({ text: 'Usa los botones para cambiar de página.' })
      .setTimestamp();

    // Página 2 — Redes sociales
    const p2 = new EmbedBuilder()
      .setColor('#5865F2')
      .setAuthor({ name: 'Redes Oficiales — Página 2/3' })
      .setTitle('Presencia en redes sociales')
      .setDescription(
        `Sigue a **Gerasaurio** en las siguientes plataformas. En esta sección hemos dejado espacio para ` +
        `incorporar **emojis personalizados adicionales** cuando los tengas listos.`
      )
      .addFields(
        { name: `${eIG} Instagram`, value: 'https://www.instagram.com/gerasaurio?igsh=Y3ZhZmsweXFjemFn&utm_source=qr', inline: false },
        { name: `${eWA} WhatsApp (Canal)`, value: 'https://www.whatsapp.com/channel/0029Vb5wtAsAu3aLg23yDI1N', inline: false },
        { name: `${eYT} YouTube`, value: 'https://www.youtube.com/@gerasaurio?si=2XbapUX9RDTytGMW', inline: false },
        { name: `${eTT} TikTok`, value: 'https://www.tiktok.com/@gerasaurio?_t=zs-8vvoqzpaave&_r=1', inline: false },
      )
      .setFooter({ text: 'Consejo: comparte esta tarjeta con tu comunidad.' })
      .setTimestamp();

    // Página 3 — Juegos (Roblox)
    const p3 = new EmbedBuilder()
      .setColor('#FF5252')
      .setAuthor({ name: 'Redes Oficiales — Página 3/3' })
      .setTitle(`${eRBX} Perfil en plataformas de juego`)
      .setDescription(
        `Explora el perfil de **Gerasaurio** en plataformas de juegos y mantente al día de sus actividades.\n\n` +
        `> ${eRBX} **Roblox:** https://www.roblox.com/users/8917660484/profile\n\n` +
        `¿Quieres que agreguemos más juegos? Envíame los enlaces y lo integramos en una nueva página.`
      )
      .setFooter({ text: 'Solicitado por la comunidad de Gerasaurio' })
      .setTimestamp();

    await paginate(message, [p1, p2, p3], { time: 180000 });
  },
};
