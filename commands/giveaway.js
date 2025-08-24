const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/db');

module.exports = {
  name: 'giveaway',
  category: 'Sorteos',
  description: 'Crea un sorteo con botón Participar y selección de ganador.',
  usage: '!giveaway <premio o mensaje>',
  async execute(message, args) {
    const cfg = getGuildConfig(message.guild.id);

    // requerir roles autorizados si existen, si no existen, requiere Admin
    const hasAuthorizedRole = cfg.giveawayManagerRoleIds?.some(rid => message.member.roles.cache.has(rid));
    const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
    if (!(hasAuthorizedRole || isAdmin)) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE74C3C).setTitle('＜:lock_IDS:1403559848318205984＞ No estás autorizado').setDescription('Pide a un administrador que te agregue en `!giveaway-config roles`.')
      ]});
    }

    const prize = args.join(' ');
    if (!prize) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE67E22).setDescription('Uso: `!giveaway <premio o mensaje>`')
      ]});
    }

    const author = message.author;

    const baseEmbed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle('🎉 Sorteo activo')
      .setDescription(`**Premio:** ${prize}`)
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: 'Participantes', value: '*Sin participantes aún*', inline: false },
        { name: 'Autor del sorteo', value: `<@${author.id}>`, inline: true }
      )
      .setFooter({ text: 'Presiona "Participar" para unirte' });

    const stamp = `${message.id}-${Date.now()}`; // id único por sorteo

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`give:join:${author.id}:${stamp}`)
        .setEmoji({ name: '1st', id: '1403557964480118874' })
        .setLabel('Participar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`give:start:${author.id}:${stamp}`)
        .setEmoji({ name: 'Settings_animation', id: '1403778350723498085' })
        .setLabel('Empezar Sorteo')
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await message.channel.send({ embeds: [baseEmbed], components: [row] });

    // Guardar estado en memoria (caché del proceso)
    if (!message.client.giveaways) message.client.giveaways = new Map();
    message.client.giveaways.set(stamp, {
      message: msg,
      baseEmbed,
      ownerId: author.id,
      prize,
      participants: [],
      claimChannelId: null
    });
  }
};
