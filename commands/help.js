const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { defaultPrefix } = require('../config.json');
const { getGuildConfig } = require('../utils/db');

module.exports = {
  name: 'help',
  category: 'Información',
  description: 'Muestra ayuda y comandos por categorías con paginación.',
  usage: '!help',
  async execute(message, args, client) {
    const gcfg = getGuildConfig(message.guild.id);
    const prefix = gcfg.prefix || defaultPrefix;

    // agrupar por categoría
    const byCat = {};
    client.commands.forEach(c => {
      const cat = c.category || 'Otros';
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(c);
    });

    const categories = Object.keys(byCat);
    const embeds = categories.map(cat => {
      const lines = byCat[cat]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => `• \`${prefix}${c.name}\` — ${c.description || 'Sin descripción'}`);
      return new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`＜:Settings_animation:1403778350723498085＞ Ayuda — ${cat}`)
        .setDescription(lines.join('\n') || '*No hay comandos*')
        .setFooter({ text: `Página ${categories.indexOf(cat) + 1}/${categories.length} • Prefix: ${prefix}` });
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('help:prev:0')
        .setEmoji({ name: 'arrow_left', id: '1403777608138887189' })
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('help:next:0')
        .setEmoji({ name: 'arrow_right', id: '1403777582440251393' })
        .setStyle(ButtonStyle.Secondary)
    );

    const sent = await message.channel.send({ embeds: [embeds[0]], components: [row] });
    if (!client.helpEmbeds) client.helpEmbeds = {};
    client.helpEmbeds[sent.id] = embeds;
  }
};
