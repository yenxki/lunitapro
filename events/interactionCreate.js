const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/db');

function paginateEmbed(embeds, page) {
  const total = embeds.length;
  const index = ((page % total) + total) % total;
  return { embed: embeds[index], index, total };
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const [scope, action, ...rest] = interaction.customId.split(':');

    // --- HELP PAGINATION ---
    if (scope === 'help') {
      const page = parseInt(rest[0] || '0', 10);
      const embeds = client.helpEmbeds?.[interaction.message.id];
      if (!embeds) return interaction.deferUpdate();

      const { embed, index, total } = paginateEmbed(embeds, action === 'next' ? page + 1 : page - 1);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`help:prev:${index}`)
          .setEmoji({ name: 'arrow_left', id: '1403777608138887189' })
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`help:next:${index}`)
          .setEmoji({ name: 'arrow_right', id: '1403777582440251393' })
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.update({ embeds: [embed], components: [row] });
      return;
    }

    // --- REDES PAGINATION ---
    if (scope === 'redes') {
      const page = parseInt(rest[0] || '0', 10);
      const embeds = client.redesEmbeds?.[interaction.message.id];
      if (!embeds) return interaction.deferUpdate();

      const { embed, index } = paginateEmbed(embeds, action === 'next' ? page + 1 : page - 1);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`redes:prev:${index}`)
          .setEmoji({ name: 'arrow_left', id: '1403777608138887189' })
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`redes:next:${index}`)
          .setEmoji({ name: 'arrow_right', id: '1403777582440251393' })
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.update({ embeds: [embed], components: [row] });
      return;
    }

    // --- GIVEAWAY BUTTONS ---
    if (scope === 'give') {
      const sub = action; // join | start
      const ownerId = rest[0];
      const stamp = rest[1]; // unique ID to avoid collisions per message

      // Recuperar estado guardado en caché del cliente
      const entry = client.giveaways?.get(stamp);
      if (!entry) return interaction.reply({ ephemeral: true, embeds: [
        new EmbedBuilder().setColor(0xE67E22).setTitle('＜:notice:1403559870656942134＞ Sorteo no encontrado')
      ]});

      // JOIN
      if (sub === 'join') {
        const userId = interaction.user.id;
        if (entry.participants.some(p => p.id === userId)) {
          return interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder().setColor(0xF1C40F).setDescription('Ya estás participando. ¡Suerte!')]
          });
        }
        entry.participants.push({ id: userId, tag: interaction.user.tag });
        client.giveaways.set(stamp, entry);

        // actualizar embed con lista
        const list = entry.participants.map((p, i) => `**${i + 1}.** <@${p.id}>`).join('\n') || '*Sin participantes aún*';

        const updated = EmbedBuilder.from(entry.baseEmbed)
          .setFields(
            { name: 'Participantes', value: list, inline: false },
            { name: 'Autor del sorteo', value: `<@${entry.ownerId}>`, inline: true }
          );

        await interaction.update({ embeds: [updated] });
        return;
      }

      // START (solo dueño)
      if (sub === 'start') {
        if (interaction.user.id !== ownerId) {
          return interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder().setColor(0xE74C3C).setDescription('Solo quien creó el sorteo puede iniciarlo.')]
          });
        }
        if (entry.participants.length < 1) {
          return interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder().setColor(0xE67E22).setDescription('No hay participantes suficientes.')]
          });
        }

        // "animación" rápida: mostrar nombres cambiando
        const spinList = entry.participants.map(p => `<@${p.id}>`);
        let i = 0;
        const spinMsg = await interaction.reply({
          fetchReply: true,
          embeds: [new EmbedBuilder().setColor(0x9B59B6).setTitle('Girando... 🎉')]
        });

        const interval = setInterval(async () => {
          i = (i + 1) % spinList.length;
          await interaction.editReply({
            embeds: [new EmbedBuilder().setColor(0x9B59B6).setTitle('Girando... 🎉').setDescription(spinList[i])]
          }).catch(() => {});
        }, 200);

        // parar después de ~4s y anunciar ganador
        setTimeout(async () => {
          clearInterval(interval);
          const winner = entry.participants[Math.floor(Math.random() * entry.participants.length)];
          const gcfg = getGuildConfig(interaction.guild.id);

          // Editar mensaje original del sorteo
          const final = EmbedBuilder.from(entry.baseEmbed)
            .setColor(0x2ECC71)
            .setTitle('¡Tenemos ganador! 🎉')
            .setDescription(`**Felicidades <@${winner.id}>**, entre todos los participantes eres el ganador: **${entry.prize}**\n\nEntra a **<#${entry.claimChannelId || 'por-crear'}>** para reclamar tu premio.`)
            .setFields({ name: 'Participantes', value: spinList.join(' '), inline: false });

          // crear canal "ganador-<usuario>" en la categoría configurada
          let createdChannel = null;
          if (gcfg.giveawayCategoryId) {
            try {
              createdChannel = await interaction.guild.channels.create({
                name: `ganador-${winner.tag.split('#')[0].toLowerCase().replace(/[^a-z0-9_-]/g,'')}`,
                type: ChannelType.GuildText,
                parent: gcfg.giveawayCategoryId,
                permissionOverwrites: [
                  { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                  { id: winner.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                  ...gcfg.giveawayManagerRoleIds.map(rid => ({
                    id: rid,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels]
                  }))
                ]
              });
            } catch (e) {
              console.error(e);
            }
          }

          // actualizar referencia de canal en el embed final
          if (createdChannel) {
            final.setDescription(`**Felicidades <@${winner.id}>**, entre todos los participantes eres el ganador: **${entry.prize}**\n\nEntra a **${createdChannel}** para reclamar tu premio.`);
          } else {
            final.addFields({ name: 'Nota', value: 'No hay categoría de sorteos configurada o no pude crear el canal.', inline: false });
          }

          await entry.message.edit({ embeds: [final], components: [] }).catch(() => {});

          // mandar mensaje en el canal creado
          if (createdChannel) {
            await createdChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0x2ECC71)
                  .setTitle('🎁 Canal de ganador')
                  .setDescription(`¡Hola <@${winner.id}>! Usa este canal para coordinar tu premio: **${entry.prize}**`)
              ]
            }).catch(() => {});
          }

          // finalizar animación
          await interaction.editReply({
            embeds: [new EmbedBuilder().setColor(0x2ECC71).setTitle('¡Listo!').setDescription(`Ganador: <@${winner.id}>`)]
          }).catch(() => {});

          client.giveaways.delete(stamp);
        }, 4000);

        return;
      }
    }
  }
};
