const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require('../../data/economy.json');
const { formatNumber } = require('../../utils/formatter');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb', 'top'],
  description: 'Muestra el top de usuarios más ricos.',
  usage: '!leaderboard',
  run: async (client, message) => {
    const data = Object.entries(db).sort((a, b) => b[1].money - a[1].money);
    if (data.length === 0) return message.channel.send('❌ No hay datos en la economía.');

    const pageSize = 10;
    let page = 0;

    const generateEmbed = (page) => {
      const start = page * pageSize;
      const end = start + pageSize;
      const current = data.slice(start, end);

      const description = current.map(([id, userData], index) => {
        const user = message.guild.members.cache.get(id);
        return `**#${start + index + 1}** ${user ? user.user.username : 'Usuario desconocido'} — 🪙 ${formatNumber(userData.money)}`;
      }).join('\n');

      return new EmbedBuilder()
        .setColor('#9333EA')
        .setTitle('🏆 Ranking de Economía')
        .setDescription(description || 'No hay más usuarios.')
        .setFooter({ text: `Página ${page + 1}/${Math.ceil(data.length / pageSize)}` })
        .setTimestamp();
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.channel.send({ embeds: [generateEmbed(page)], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: 'Solo el autor puede usar estos botones.', ephemeral: true });
      }
      if (interaction.customId === 'prev') {
        page = page > 0 ? page - 1 : Math.floor(data.length / pageSize);
      } else if (interaction.customId === 'next') {
        page = page < Math.floor(data.length / pageSize) ? page + 1 : 0;
      }
      await interaction.update({ embeds: [generateEmbed(page)], components: [row] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  },
};
