const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setGuildConfig, getGuildConfig } = require('../utils/db');

module.exports = {
  name: 'giveaway-config',
  category: 'Configuración',
  description: 'Configura roles autorizados y la categoría para canales de ganadores.',
  usage: '!giveaway-config roles @Rol1 @Rol2\n!giveaway-config categoria #categoria\n!giveaway-config ver',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE74C3C).setTitle('＜:lock_IDS:1403559848318205984＞ Solo administradores')
      ]});
    }

    const sub = (args.shift() || '').toLowerCase();

    if (sub === 'roles') {
      const roles = message.mentions.roles.map(r => r.id);
      if (!roles.length) {
        return message.channel.send({ embeds: [
          new EmbedBuilder().setColor(0xE67E22).setDescription('Menciona uno o más roles: `!giveaway-config roles @Rol1 @Rol2`')
        ]});
      }
      setGuildConfig(message.guild.id, { giveawayManagerRoleIds: roles });
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0x2ECC71).setDescription(`Roles autorizados actualizados: ${roles.map(r => `<@&${r}>`).join(', ')}`)
      ]});
    }

    if (sub === 'categoria') {
      const ch = message.mentions.channels.first();
      if (!ch || ch.type !== ChannelType.GuildCategory) {
        return message.channel.send({ embeds: [
          new EmbedBuilder().setColor(0xE67E22).setDescription('Menciona una **categoría** válida: `!giveaway-config categoria #TuCategoria`')
        ]});
      }
      setGuildConfig(message.guild.id, { giveawayCategoryId: ch.id });
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0x2ECC71).setDescription(`Categoría de sorteos establecida en ${ch.name}.`)
      ]});
    }

    if (sub === 'ver') {
      const cfg = getGuildConfig(message.guild.id);
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0x3498DB)
          .setTitle('Configuración de Sorteos')
          .addFields(
            { name: 'Roles autorizados', value: (cfg.giveawayManagerRoleIds?.map(r => `<@&${r}>`).join(', ') || '*Ninguno*'), inline: false },
            { name: 'Categoría', value: cfg.giveawayCategoryId ? `<#${cfg.giveawayCategoryId}>` : '*No configurada*', inline: false }
          )
      ]});
    }

    return message.channel.send({ embeds: [
      new EmbedBuilder().setColor(0xE67E22).setDescription('Uso:\n`!giveaway-config roles @Rol1 @Rol2`\n`!giveaway-config categoria #categoria`\n`!giveaway-config ver`')
    ]});
  }
};
