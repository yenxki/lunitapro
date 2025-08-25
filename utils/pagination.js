// utils/pagination.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Crea una paginación simple con botones para un array de Embeds.
 * @param {Message} message - Mensaje que ejecutó el comando.
 * @param {Array<EmbedBuilder>} pages - Embeds a paginar.
 * @param {object} opts - Opciones { time, placeButtonsTop }
 */
async function paginate(message, pages, opts = {}) {
  if (!pages || !pages.length) return;
  const time = opts.time ?? 120000; // 2 minutos
  let index = 0;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('pag_prev').setLabel('◀ Anterior').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('pag_stop').setLabel('⏹ Cerrar').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('pag_next').setLabel('Siguiente ▶').setStyle(ButtonStyle.Primary),
  );

  const sent = await message.channel.send({
    embeds: [pages[index]],
    components: [row],
  });

  const collector = sent.createMessageComponentCollector({
    filter: (i) => i.user.id === message.author.id,
    time,
  });

  collector.on('collect', async (interaction) => {
    try {
      if (interaction.customId === 'pag_prev') index = (index - 1 + pages.length) % pages.length;
      if (interaction.customId === 'pag_next') index = (index + 1) % pages.length;
      if (interaction.customId === 'pag_stop') {
        collector.stop('stopped');
        return interaction.update({ components: [] });
      }

      await interaction.update({
        embeds: [pages[index]],
        components: [row],
      });
    } catch (e) {
      // ignora errores de actualización
    }
  });

  collector.on('end', () => {
    try {
      sent.edit({ components: [] }).catch(() => {});
    } catch {}
  });
}

module.exports = { paginate };
