const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'help',
  aliases: ['ayuda'],
  description: 'Muestra la lista de comandos por categorías.',
  usage: '!help',
  run: async (client, message) => {
    const categories = fs.readdirSync('./commands');
    let currentPage = 0;

    // Crear páginas por categoría
    const pages = categories.map(cat => {
      const commands = fs.readdirSync(`./commands/${cat}`).filter(file => file.endsWith('.js'));
      const commandList = commands.map(file => {
        const cmd = require(`../../commands/${cat}/${file}`);
        return `\`${cmd.name}\` - ${cmd.description || 'Sin descripción.'}`;
      }).join('\n');

      // Emojis personalizados (añade tus IDs)
      const emojiMap = {
        admin: '<:admin:ID>',
        mod: '<:mod:ID>',
        economy: '<:economy:ID>',
        everyone: '<:everyone:ID>',
        info: '<:info:ID>'
      };

      return new EmbedBuilder()
        .setColor('#6366F1')
        .setTitle(`${emojiMap[cat] || '📂'} Categoría: ${cat}`)
        .setDescription(commandList || 'No hay comandos en esta categoría.')
        .setFooter({ text: `Página ${categories.indexOf(cat) + 1} de ${categories.length}` });
    });

    // Botones
    const getButtons = () => new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⬅️ Anterior')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️ Siguiente')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === pages.length - 1)
    );

    const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [getButtons()] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.user.id !== message.author.id) return i.reply({ content: '❌ No puedes usar estos botones.', ephemeral: true });

      if (i.customId === 'prev' && currentPage > 0) currentPage--;
      if (i.customId === 'next' && currentPage < pages.length - 1) currentPage++;

      await i.update({ embeds: [pages[currentPage]], components: [getButtons()] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  }
};
